var express = require('express'),
	router = express.Router(),
	acceptLang = require('accept-language'),
	api = require('./module/api'),
	DOCUMENT = api.DOCUMENT;

// middleware specific to this router
router.use(function (req,res,next) {
	next();
});

router.get('/track1/saveDocument/',function (req,res) {
	console.log("in save Document..." );
	DOCUMENT.saveDocument();
});

module.exports = router;