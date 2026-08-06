const express = require('express');
const router = express.Router();
const GlobalNotice = require('../../models/GlobalNotice');
const { sendSuccess } = require('../../utils/response');
const { protect } = require('../../middleware/auth');

// @desc    Get all global notices
// @route   GET /api/notices
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const notices = await GlobalNotice.find({}).sort({ createdAt: -1 });
    return sendSuccess(res, { data: notices });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
