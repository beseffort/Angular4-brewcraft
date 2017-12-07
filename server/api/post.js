var express = require('express');
var router = express.Router();
var fs = require('graceful-fs');
var Util = require('../lib/util');
var db = require('firebase').database();

var postRef = db.ref('posts');

router.post('/add', (req, res) => {
    var post = postRef.push();

    if(req.body.mediaType == "photo") {
        var filepath = '/posts/' + post.key;
        Util.uploadPhoto(req.body.url, filepath);
        req.body.url = filepath;
    }

    post.setWithPriority(req.body, 0 - Date.now())
        .then(result => {
            db.ref('users/' + req.body.writerUid).once('value', (snapshot) => {
                db.ref('users/' + req.body.writerUid).update({opinions: snapshot.val().opinions ? snapshot.val().opinions + 1: 1})
            })
            Util.responseHandler(res, true, "", req.body);
            Util.updateLevel(req.body.writerUid);
        })
        .catch(error => Util.responseHandler(res, false, error.message))
});

router.get('/get/:limit', (req, res) => {
    console.log(req.params.limit);''
    postRef.orderByChild('date').limitToFirst(+req.params.limit).once('value', (snapshot) => {
        if(snapshot.val() == null)
            Util.responseHandler(res, false, 'There are no posts available');
        var data = new Array();
        for (var key in snapshot.val()) {
            if (snapshot.val().hasOwnProperty(key)) {
                var element = snapshot.val()[key];
                data.push(element);
            }
        }
        Util.responseHandler(res, false, '', data)
    })
})



module.exports = router;