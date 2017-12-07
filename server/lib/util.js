'use strict'
var fs = require('graceful-fs');
var randomAccessFile = require('random-access-file');
var global = require('../global/config');
const nodemailer = require('nodemailer');
var db = require('firebase').database();
var mailerhbs = require('nodemailer-express-handlebars');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //user: 'wbitsale@gmail.com',
        //pass: 'wbit2017'
         user: 'noreply@brewcraft.io',
         pass: 'F00tba!!'
    }
});

transporter.use('compile', mailerhbs({
    viewEngine: {
         extname: '.hbs',
         layoutsDir: 'emails',
         //defaultLayout : 'template',
         partialsDir : 'emails/partials/'
    },
    viewPath: 'emails', //Path to email template folder
    extName: '.hbs' //extendtion of email template
}));

// setup email data with unicode symbols
let mailOptions = {
    from: '"Do not reply" <noreply@brewcraft.io>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    // text: 'Hello world ?', // plain text body
    // html: '<b>Hello world ?</b>' // html body
};

function uploadPhoto(data, filepath) {
    data = data.replace(/^data:image\/jpeg;base64,/, "");
    data = data.replace(/^data:image\/png;base64,/, "");
    var imageBuffer = new Buffer(data, 'base64'); //console = <Buffer 75 ab 5a 8a ...
    fs.writeFile('public' + filepath, imageBuffer, function (err) {
        console.log(err);
        return filepath;
    });
}

function copyProps(dest, src) {
    for(var k in src) dest[k]=src[k];
}

function sendMail(to, subject, message , context = '') {
    mailOptions.to = to;
    mailOptions.subject = subject;
    //mailOptions.html = message;
    mailOptions.template = message;
    mailOptions.context = context;
    transporter.sendMail(mailOptions, (error, info) => {
        // console.log(error, info);
    });
}

function updateLevel(uid) {
    db.ref('users/' + uid).once('value', (snapshot) => {
        var recipes = snapshot.val().recipes;
        var brewdays = snapshot.val().brewdays;
        var opinions = snapshot.val().opinions;
        var level = 1;
        if(brewdays > 20 && recipes >= 10 && opinions >= 500)
            level = 2;
        if(brewdays > 60 && recipes >= 30 && opinions >= 1500)
            level = 3;
        if(brewdays > 180 && recipes >= 90 && opinions >= 4500)
            level = 4;
        if(brewdays > 540 && recipes >= 270 && opinions >= 13500)
            level = 5;
        db.ref('users/' + uid).update({level: level});
    })
}

module.exports = {
    SERVER_URL: global.server_url,
    responseHandler: (res, success, message, data) => {
        res.send({
            success: success,
            message: message,
            data: data
        });
    },
    uploadPhoto: uploadPhoto,
    sendMail: sendMail,
    copyProps: copyProps,
    updateLevel: updateLevel,
    transporter : transporter
}
