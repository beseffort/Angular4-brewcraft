var express = require('express');
var router = express.Router();
var Util = require('../lib/util');
var db = require('firebase').database();
var Account = require('../model/model').Account;
var Guild = require('../model/model').Guild;
var Message = require('../model/model').Message;

var guildsRef = db.ref('guilds');
var usersRef = db.ref('users');
var messagesRef = db.ref('messages');

router.post('/send', (req, res) => {
    var message = new Message();
    Util.copyProps(message, req.body);

    var senderID = req.body.sender;
    var receiverID = req.body.receiver;
    db.ref('users/' + senderID).once('value', (snapshot) => {
        var sender = snapshot.val();
        db.ref('users/' + receiverID).once('value', (snapshot) => {
            var receiver = snapshot.val();
            console.log(receiver);
            var html = `
            ${sender.fullname} has sent private message to you on brewcraft<br>
            <b>subject:</b> ${message.subject}<br>
            <b>content:</b> ${message.message}
            `;
            var context = {
              msg : html
            };
            Util.sendMail(receiver.email, "Private message sent", "private_msg", context);
            //Util.sendMail(receiver.email, 'Private message sent', html);
        })
    })

    var messageRef = messagesRef.push();
    messageRef.set(message).then(r => Util.responseHandler(res, true));
});

router.get('/get/:receiverID', (req, res) => {
    messagesRef.orderByChild('receiver').equalTo(req.params.receiverID).once('value', (snapshot) => {
        var messages = snapshot.val();
        Util.responseHandler(res, true, "", messages);
    })
})

router.put('/read', (req, res) => {

    console.log(req.body.messages);
    var messages = [...req.body.messages];
    messages.forEach(function (message) {
        console.log(message);
    }, this);
    Util.responseHandler(res, true);
})

module.exports = router;