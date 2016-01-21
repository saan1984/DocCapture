var express = require('express'),
	router = express.Router(),
	acceptLang = require('accept-language'),
	api = require('./module/api'),
	CAPTURE = api.CAPTURE;

// middleware specific to this router
router.use(function (req,res,next) {
	next();
});

router.get('/track1/capture/',function (req,res) {
	logger.debug("in capture content..." );
});

module.exports = router;