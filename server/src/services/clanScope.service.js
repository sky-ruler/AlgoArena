const Clan = require('../models/Clan');
const User = require('../models/User');
const { isGlobalOverrideRole } = require('../middleware/authorize');

const toIdString = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value._id) return value._id.toString();
  if (typeof value.toString === 'function') return value.toString();
  return null;
};

const withSession = (query, session) => {
  if (!session) return query;
  return query.session(session);
};

class ChiefClanCacheProvider {
  constructor() {
    this.cache = new Map(); // userId -> { value, expiresAt }
    this.maxSize = 5000;
    this.ttl = 60 * 1000; // 1 minute
  }

  async get(userId) {
    if (!userId) return { hit: false, value: null };
    const entry = this.cache.get(userId);
    if (!entry) {
      return { hit: false, value: null };
    }
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(userId);
      return { hit: false, value: null };
    }
    return { hit: true, value: entry.value };
  }

  async set(userId, value) {
    if (!userId) return;
    if (this.cache.size >= this.maxSize) {
      this.cache.clear();
    }
    this.cache.set(userId, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }

  async delete(userId) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  async clear() {
    this.cache.clear();
  }
}

const cacheProvider = new ChiefClanCacheProvider();

const clearChiefClanCache = (userId) => {
  cacheProvider.delete(userId).catch(() => {});
};

const findChiefClan = async (userId, session = null) => {
  if (!userId) return null;

  if (!session) {
    const cached = await cacheProvider.get(userId);
    if (cached.hit) {
      return cached.value;
    }
  }

  const query = Clan.findOne({ chief: userId }).select('_id chief members');
  const clan = await withSession(query, session).lean();

  if (!session) {
    await cacheProvider.set(userId, clan || null);
  }

  return clan || null;
};

const resolveActorScope = async (actor, { session = null } = {}) => {
  if (!actor) {
    return { kind: 'none', reason: 'Missing actor context' };
  }

  if (isGlobalOverrideRole(actor)) {
    return { kind: 'global' };
  }

  if (actor.role !== 'clan-chief') {
    return { kind: 'none', reason: 'Only clan chiefs, moderators, or admins can perform this action' };
  }

  const actorId = toIdString(actor._id || actor.id);
  const chiefClan = await findChiefClan(actorId, session);
  if (!chiefClan) {
    return { kind: 'none', reason: 'Chief role is not mapped to any clan' };
  }

  return {
    kind: 'clan',
    clanId: chiefClan._id.toString(),
    clan: chiefClan,
  };
};

const canActorManageClan = async (actor, clanOrId, { session = null } = {}) => {
  const scope = await resolveActorScope(actor, { session });
  if (scope.kind === 'global') {
    return { allowed: true, scope };
  }
  if (scope.kind !== 'clan') {
    return { allowed: false, reason: scope.reason, scope };
  }

  const targetClanId = toIdString(clanOrId && (clanOrId._id || clanOrId));
  if (!targetClanId || targetClanId !== scope.clanId) {
    return { allowed: false, reason: 'Clan chiefs can only act within their own clan', scope };
  }

  return { allowed: true, scope };
};

const canActorManageUser = async (actor, targetUser, { session = null } = {}) => {
  const scope = await resolveActorScope(actor, { session });
  if (scope.kind === 'global') {
    return { allowed: true, scope };
  }
  if (scope.kind !== 'clan') {
    return { allowed: false, reason: scope.reason, scope };
  }

  const targetClanId = toIdString(targetUser?.clan);
  if (!targetClanId || targetClanId !== scope.clanId) {
    return { allowed: false, reason: 'Clan chiefs can only act on members of their own clan', scope };
  }

  return { allowed: true, scope };
};

const getActorMemberIdsInScope = async (actor, { session = null } = {}) => {
  const scope = await resolveActorScope(actor, { session });
  if (scope.kind === 'global') {
    return { allowed: true, scope, memberIds: null };
  }
  if (scope.kind !== 'clan') {
    return { allowed: false, reason: scope.reason, scope, memberIds: [] };
  }

  let clan = scope.clan;
  if (!clan) {
    const query = Clan.findById(scope.clanId).select('_id members');
    clan = await withSession(query, session).lean();
  }
  const memberIds = (clan?.members || []).map((memberId) => memberId.toString());
  return { allowed: true, scope, memberIds };
};

const reconcileChiefRoleForUser = async (userId, { session = null } = {}) => {
  const normalizedId = toIdString(userId);
  if (!normalizedId) return false;

  const userQuery = User.findById(normalizedId).select('role');
  const user = await withSession(userQuery, session);
  if (!user) return false;

  const chiefClanCountQuery = Clan.countDocuments({ chief: normalizedId });
  const chiefClanCount = await withSession(chiefClanCountQuery, session);

  if (chiefClanCount === 0 && user.role === 'clan-chief') {
    await withSession(
      User.updateOne({ _id: normalizedId }, { $set: { role: 'user' } }),
      session
    );
    return true;
  }

  if (chiefClanCount > 0 && user.role === 'user') {
    await withSession(
      User.updateOne({ _id: normalizedId }, { $set: { role: 'clan-chief' } }),
      session
    );
    return true;
  }

  return false;
};

module.exports = {
  toIdString,
  isGlobalOverrideRole,
  resolveActorScope,
  canActorManageClan,
  canActorManageUser,
  getActorMemberIdsInScope,
  reconcileChiefRoleForUser,
  clearChiefClanCache,
  cacheProvider,
};
