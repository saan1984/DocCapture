var express = require('express'),
	router = express.Router(),
	api = require('./module/api'),
	DOCUMENT = api.DOCUMENT;

// middleware specific to this router
router.use(function (req,res,next) {
	next();
});

router.post('/track1/saveDocument/',function (req,res) {
	console.log("in save Document...",req);
	//DOCUMENT.saveDocument(documentId, imageArray);
	res.send(req.body);
});

module.exports = router;