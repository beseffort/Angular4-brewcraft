var express = require('express');
var router = express.Router();
var fs = require('graceful-fs');
var bCrypt = require('bcrypt-nodejs');
var Util = require('../lib/util');
var db = require('firebase').database();
var Account = require('../model/model').Account;
var auth = require('firebase').auth();
var guildsRef = db.ref('guilds');
var usersRef = db.ref('users');

router.post('/send-email' , (req , res) => {
  var to = req.body.email;
  var subject = req.body.subject;
  var template = req.body.template;
  var context = (req.body.context != undefined)?req.body.context:'';
  //console.log(context);
  Util.sendMail(to, subject, template, context);
  Util.responseHandler(res, true, "mail sent.", req.body);
})

router.post('/add', (req, res) => {
    req.body.password = [req.body.password];

    var account = new Account();
    Util.copyProps(account, req.body);
    account.joinDate = account.joinDate.toString();
    db.ref('users/' + account.uid).once('value')
        .then(snapshot => {
            if (snapshot.val() == null) {
                db.ref('users/' + account.uid).set(account)
                    .then(account => {
                        Util.responseHandler(res, true);
                    });
            } else {
                Util.responseHandler(res, false);
            }
        })
        .catch(err => {
            Util.responseHandler(res, false, err.message);
        });
});

router.get('/get/:uid', (req, res) => {
    db.ref('users/' + req.params.uid).once('value')
        .then(snapshot => {
            if (snapshot.val() == null)
                Util.responseHandler(res, false, 'The user with such uid doesn\'t exists', null);
            else
                Util.responseHandler(res, true, 'Success', snapshot.val());
        })
})

router.get('/send-password-reset-mail/:email', (req, res) => {
    console.log('password reset mail', req.params.email);
    auth.sendPasswordResetEmail(req.params.email)
        .then(result => {
            Util.responseHandler(res, true, 'Password reset email has sent to your email address');
        })
        .catch(result => {
            console.log(result);
            Util.responseHandler(res, false, result.message);
        })
})

router.get('/reset-password/:code/:newpassword', (req, res) => {
    console.log('password reset confirm', req.params.code, req.params.newpassword);
    var password = req.params.newpassword;
    auth.verifyPasswordResetCode(req.params.code)
        .then(email => {
            db.ref('users').orderByChild('email').equalTo(email).once('value', (snapshot) => {
                var uid = Object.keys(snapshot.val())[0];
                var user = snapshot.val()[uid];
                var repeat_password_count = 0;
                for (var i = 0; i < user.password.length; i++) {
                    if (user.password[i] == password)
                        repeat_password_count++;
                }
                if (repeat_password_count < 5) {

                    auth.confirmPasswordReset(req.params.code, req.params.newpassword)
                        .then(result => {
                            Util.responseHandler(res, true, 'Password reset successfully');
                        }).catch(err => {
                            Util.responseHandler(res, false, err.message);
                        })
                    user.password.push(password);
                    user.locked = false;
                    db.ref('users/' + uid).set(user)
                        .then(user => console.log(user));
                } else {
                    Util.responseHandler(res, false, 'You have already used the same password 5 times. Please use different one');
                }
            })
        })
        .catch(err => {
            Util.responseHandler(res, false, err.message);
        })
})

router.get('/check-locked/:uid', (req, res) => {
    db.ref('users/' + req.params.uid).once('value', (snapshot) => {
     Util.responseHandler(res, true, 'Success', {
            locked: !1
        })
    })
})

router.put('/lock/:email', (req, res) => {
    db.ref('users').orderByChild('email').equalTo(req.params.email).once('value', (snapshot) => {
        var uid = Object.keys(snapshot.val())[0];
        var user = snapshot.val()[uid];
        if (user != null) {
            var account = db.ref('users/' + user.uid);
            account.update({ locked: true }, (err) => {
                console.log(err);
                if (err) {
                    Util.responseHandler(res, false, 'Error occured while locking the account');
                } else {
                    var context = {
                      link : "http://www.brewcraft.io/change-password"
                    };
                    Util.sendMail(req.params.email, "Account locked", "account_locked", context);
                    // Util.sendMail(req.params.email, "Account locked", `
                    // Your account has been locked due to security reasons. Please follow this link to change your password.<br>
                    // http://34.205.172.156/change-password
                    // `);
                    Util.responseHandler(res, true, 'The account has been locked');
                }
            })
        }
    });
})

router.put('/lockout/:uid', (req, res) => {
    var account = db.ref('users/' + req.params.uid);
    account.update({ locked: false }, (err) => {
        console.log(err);
        if (err) {
            Util.responseHandler(res, false, 'Error occured while unlocking the account');
        } else {
            Util.responseHandler(res, true, 'The account has been locked out');
        }
    })
})

router.post('/search', (req, res) => {
    var keyword = new RegExp(req.body.keyword, "i");

    usersRef.once('value', (snapshot) => {
        var users = snapshot.val();
        var result = [];
        for (var key in users) {
            if (users.hasOwnProperty(key)) {
                var user = users[key];
                if (user.fullname.search(keyword) != -1)
                    result.push(user)
                else {
                    if (user.credential_provider == "password")
                        if (user.email.search(keyword) != -1)
                            result.push(user);
                }
            }
        }
        Util.responseHandler(res, true, "Success", result);
    })
})

router.post('/follow', (req, res) => {
    var followingID = req.body.following;
    var followedID = req.body.followed;

    db.ref('users/' + followingID).once('value', (snapshot) => {
        var followingUser = snapshot.val();
        if (followingUser.following == undefined)
            followingUser.following = [];
        if (followingUser.following.indexOf(followedID) == -1) {
            followingUser.following.push(followedID);
            db.ref('users/' + followingID).update({ following: followingUser.following });
            db.ref('users/' + followedID).once('value', (snapshot) => {
                var followedUser = snapshot.val();
                if (followedUser.followed == undefined)
                    followedUser.followed = [];
                if (followedUser.followed.indexOf(followingID) == -1) {
                    followedUser.followed.push(followingID)
                    db.ref('users/' + followedID).update({ followed: followedUser.followed });
                }
                Util.responseHandler(res, true);
            })
        } else {
            Util.responseHandler(res, false, 'You are already following this user');
        }
    })
})

router.post('/unfollow', (req, res) => {
    var followingID = req.body.following;
    var followedID = req.body.followed;

    db.ref('users/' + followingID).once('value', (snapshot) => {
        var followingUser = snapshot.val();
        if (followingUser.following == undefined)
            followingUser.following = [];
        var pos;
        while ((pos = followingUser.following.indexOf(followedID)) > -1) {
            followingUser.following.splice(pos, 1);
        }
        db.ref('users/' + followingID).update({ following: followingUser.following });
    })
    db.ref('users/' + followedID).once('value', (snapshot) => {
        var followedUser = snapshot.val();
        if (followedUser.followed == undefined)
            followedUser.followed = [];
        var pos;
        while ((pos = followedUser.followed.indexOf(followingID)) > -1) {
            followedUser.followed.splice(pos, 1);
        }
        db.ref('users/' + followedID).update({ followed: followedUser.followed });
        Util.responseHandler(res, true);
    })
})

router.put('/update-photo/:uid', (req, res) => {
    console.log('uid', req.body.photo);
    var uid = req.params.uid;
    var filepath = '/assets/gravatar/' + uid;
    Util.uploadPhoto(req.body.photo, filepath);
    
    db.ref('users/' + uid).update({
        photoUrl: filepath
    }).then(result => Util.responseHandler(res, true, '', filepath));
})

router.put('/update-profile/:uid', (req, res) => {
    var uid = req.params.uid;
    console.log(req.body.profile);
    db.ref('users/' + uid).update(req.body.profile).then(result => Util.responseHandler(res, true, '', result));
})

// Generates hash using bCrypt
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = router;