var express = require('express'),
	router = express.Router(),
	api = require('./module/api'),
	DOCUMENT = api.DOCUMENT;

// middleware specific to this router
router.use(function (req,res,next) {
	next();
});

router.post('/track1/saveDocument/',function (req,res) {

	var documentId = req.body.documentId,
		documentContent= req.body.conentImageArray;
	DOCUMENT.saveDocument(documentId, documentContent);
	res.send([{
		"documentId":documentId,
		"documentContent":documentContent
	}]);
});

module.exports = router;