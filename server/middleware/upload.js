const multer = require('multer')

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, `${__dirname}/../../.nuxt/dist/client/img/`)
  },
  filename (req, file, cb) {
    console.log(file)
    cb(null, `${Date.now()}-${file.fieldname}-${file.originalname}`)
  }
})

const upload = multer({ storage })

function uploadImage (req, res) {
  console.log(req.file)
  return res.status(200).json(req.file.filename)
}

module.exports.multer = upload
module.exports.uploadImage = uploadImage
