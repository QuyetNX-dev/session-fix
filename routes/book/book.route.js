var express = require("express");
var multer  = require('multer')
var router = express.Router();

const controller = require('../../controller/book/book.controller')
const validate = require('../../validate/book.validate')
const middlewareLogin = require('../../middleware/authentication/login.middleware')
var upload = multer({ dest: './public/uploads/' })

router.get("/", controller.index);

router.get("/delete/:id", middlewareLogin.validateLogin, controller.delete);
  
router.get("/delete/:id/oke", middlewareLogin.validateLogin, controller.deleteOk);

router.get("/post", middlewareLogin.validateLogin, controller.post);

router.post("/post", middlewareLogin.validateLogin, upload.single('coverimage'), validate.validateBook, controller.postCreate);

router.get("/update/:id", middlewareLogin.validateLogin, controller.update);

router.post("/update/:id/done", middlewareLogin.validateLogin, controller.updateDone);

module.exports = router