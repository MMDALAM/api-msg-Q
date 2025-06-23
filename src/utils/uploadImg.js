const multer = require('multer');
const path = require('path');
const fs = require('fs');
const data = new Date();
const year = data.getFullYear().toString();
const month = data.getMonth().toString();
const day = data.getDate().toString();
function directory(req) {
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "imgs",
    year,
    month,
    day
  );
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

// تنظیم محل ذخیره‌سازی
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    req.body.fileUploadPath = path.join("public","uploads","imgs", year, month, day ,);
    cb(null, directory(req));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    req.body.originalname = uniqueSuffix;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// فیلتر فایل
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);
  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('فقط تصاویر jpeg، jpg، png مجاز هستند.'));
  }
};

const uploadImg = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
});

module.exports = uploadImg;
