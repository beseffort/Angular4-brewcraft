var express = require('express');
var router = express.Router();
var fs = require('graceful-fs');
var Util = require('../lib/util');
var db = require('firebase').database();
var schedule = require('node-schedule');

router.post('/add', (req, res) => {
    var brew = req.body.brew;
    var userID = brew.brewer_uid;

    db.ref('users/' + userID).once('value', (snapshot) => {
        scheduleBrewNotification(snapshot.val().email);
        Util.responseHandler(res, true);
    });
    var newBrew = db.ref('brews').push();
    brew.uid = newBrew.key;
    newBrew.set(brew);


})

router.get('/get-archive/:uid', (req, res) => {
    var userID = req.params.uid;

    db.ref('brews/').orderByChild('brewer_uid').equalTo(userID).once('value', snapshot => {
        if (snapshot.val() == null) {
            Util.responseHandler(res, false);
            return;
        }
        var brews = [];
        for (var key in snapshot.val()) {
            if (snapshot.val().hasOwnProperty(key)) {
                var element = snapshot.val()[key];
                brews.push(element);
            }
        }
        Util.responseHandler(res, true, '', brews);
    })
})

router.put('/complete-brew', (req, res) => {
    var uid = req.body.uid;
    var userID = req.body.brewer_uid;
    db.ref('brews/' + uid).update({ status: true })
        .then(result => Util.responseHandler(res, true));

    db.ref('users/' + userID).once('value', (snapshot) => {
        db.ref('users/' + userID).update({ brewdays: snapshot.val().brewdays ? +snapshot.val().brewdays + 1 : 1 })
    });
});

function scheduleBrewNotification(email) {
    var date = new Date();
    var preFermentationDate = new Date(date);
    var FermentationDate = new Date(date);
    var preCarbonationDate = new Date(date);
    var carbonationDate = new Date(date);

    preFermentationDate.setMinutes(preFermentationDate.getMinutes() + 1);
    FermentationDate.setMinutes(FermentationDate.getMinutes() + 2);
    preCarbonationDate.setMinutes(preCarbonationDate.getMinutes() + 3);
    carbonationDate.setMinutes(carbonationDate.getMinutes() + 4);

    schedule.scheduleJob(preFermentationDate, function () {
        var context = {
          msg : "Fermentation date is near. Please get ready for fementation"
        };
        Util.sendMail(email, "Prepare Fermentation", "frementation_msg", context);
        //Util.sendMail(email, 'Prepare Fermentation', 'Fermentation date is near. Please get ready for fementation');
    });
    schedule.scheduleJob(FermentationDate, function () {
        var context = {
          msg : "Today is Fermentation Day"
        };
        Util.sendMail(email, "Fermentation Day", "frementation_msg", context);
        //Util.sendMail(email, 'Fermentation Day', 'Today is Fermentation Day');
    });
    schedule.scheduleJob(preCarbonationDate, function () {
        var context = {
          msg : "Carbonation date is near. Please get ready for carbonation"
        };
        Util.sendMail(email, "Prepare Carbonation", "frementation_msg", context);
        //Util.sendMail(email, 'Prepare Carbonation', 'Carbonation date is near. Please get ready for carbonation');
    });
    schedule.scheduleJob(carbonationDate, function () {
        var context = {
          msg : "Today is Carbonation Day"
        };
        Util.sendMail(email, "Carbonation Day", "frementation_msg", context);
        //Util.sendMail(email, 'Carbonation Day', 'Today is Carbonation Day');
    });
}

module.exports = router;