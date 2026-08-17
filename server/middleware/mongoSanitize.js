const sanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach((item) => sanitize(item));
    } else {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith('$') || key === '__proto__' || key === 'constructor') {
          delete obj[key];
        } else if (obj[key] && typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
  }
  return obj;
};

const mongoSanitize = () => {
  return (req, res, next) => {
    if (req) {
      if (req.body) {
        sanitize(req.body);
      }
      if (req.query) {
        const sanitizedQuery = sanitize(JSON.parse(JSON.stringify(req.query)));
        Object.defineProperty(req, 'query', {
          value: sanitizedQuery,
          writable: true,
          configurable: true,
          enumerable: true
        });
      }
      if (req.params) {
        const sanitizedParams = sanitize(JSON.parse(JSON.stringify(req.params)));
        Object.defineProperty(req, 'params', {
          value: sanitizedParams,
          writable: true,
          configurable: true,
          enumerable: true
        });
      }
    }
    next();
  };
};

module.exports = mongoSanitize;
