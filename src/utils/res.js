const sendSuccess = (res, statusCode = 200, message = message || 'عملیات موفقیت‌آمیز بود', data = {} ) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

const sendError = (res, statusCode = 500, message = message || 'خطایی رخ داده است', error = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};