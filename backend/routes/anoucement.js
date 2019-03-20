const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const anoucementController = require('../controllers/anoucement')

const multer = require('multer');

const MINE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const isValid = MINE_TYPE_MAP[file.mimetype];
      let error = new  Error("Invalid mime type.");
      if( isValid ) {
          error = null;
      }
      cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MINE_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext );
  }
});

// router.get("", checkAuth, fundController.getFunds);
router.get("", checkAuth,anoucementController.getAnoucement);
router.get("/active", checkAuth,anoucementController.getActiveAnoucement);
router.post("",checkAuth,multer({storage: storage}).single('image') , anoucementController.addAnoucement);

router.put("",checkAuth,multer({storage: storage}).single('image') , anoucementController.updateAnoucement);
router.delete("/:id",checkAuth,anoucementController.delAnoucement);


module.exports = router;
