var express = require('express'),
	router = express.Router(),
	api = require('./module/api'),
	DOCUMENT = api.DOCUMENT;

// middleware specific to this router
router.use(function (req,res,next) {
	next();
});

router.get('/track1/saveDocument/',function (req,res) {
	console.log("in save Document..." );
	DOCUMENT.saveDocument(documentId, imageArray);
});

module.exports = router;