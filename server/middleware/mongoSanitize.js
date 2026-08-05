const sanitize = (obj) => {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (obj[key] && typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    });
  }
  return obj;
};

const mongoSanitize = () => {
  return (req, res, next) => {
    if (req) {
      if (req.body) sanitize(req.body);
      if (req.query) sanitize(req.query);
      if (req.params) sanitize(req.params);
    }
    next();
  };
};

module.exports = mongoSanitize;
