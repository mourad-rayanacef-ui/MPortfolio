const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const imageTypes = /jpeg|jpg|png|gif|webp/;
const pdfTypes = /pdf/;

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // CV / resume field must be a PDF
  if (file.fieldname === 'cv') {
    const extOk = pdfTypes.test(ext);
    const mimeOk = file.mimetype === 'application/pdf';
    if (extOk && mimeOk) return cb(null, true);
    return cb(new Error('CV must be a PDF file'));
  }

  // Certificate field must be a PDF
  if (file.fieldname === 'certificate') {
    const extOk = pdfTypes.test(ext);
    const mimeOk = file.mimetype === 'application/pdf';
    if (extOk && mimeOk) return cb(null, true);
    return cb(new Error('Certificate must be a PDF file'));
  }

  // Any image-type field (profileImage, image, etc.) must be an image
  const extOk = imageTypes.test(ext);
  const mimeOk = imageTypes.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  return cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
};

const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // Increase to 10MB for PDFs
  },
  fileFilter
});

module.exports = upload;