var express = require('express');
var router = express.Router();
var fs = require('graceful-fs');
var Util = require('../lib/util');
var db = require('firebase').database();
var Account = require('../model/model').Account;
var Guild = require('../model/model').Guild;
var global = require('../global/config');

var guildsRef = db.ref('guilds');
var usersRef = db.ref('users');

router.get('/show-all', (req , res)=>{
    db.ref("guilds").once('value', (snapshot) => {
        if (snapshot.val() == null) {
            Util.responseHandler(res, false);
            return;
        } else {
            var guilds = [];
            for (var key in snapshot.val()) {
                if (snapshot.val().hasOwnProperty(key)) {
                    var element = snapshot.val()[key];
                    guilds.push(element);
                }
            }
            Util.responseHandler(res, true, '', guilds);
        }
    })
});

router.post('/add-new', (req , res) => {
  var guild = new Guild();
  Util.copyProps(guild, req.body);
  var guildsRef = db.ref('guilds').push();
  guild.id = guildsRef.key;
  guild.createdDate = new Date().toString();
  // add the user to joinedMembers array 
  if(guild.joinedMembers == undefined)
      guild.joinedMembers  = [];
  guild.joinedMembers.push(req.body.chief);
  
  guildsRef.set(guild)
      .then(result => {
        db.ref('users/' + req.body.chief).update({ guildID: guildsRef.key, isChief: true });
        Util.responseHandler(res, true, "Guild added successfully.", guildsRef.key);
      });
});

router.post('/search', (req , res) => {
  var keyword = new RegExp(req.body.keyword, "i");
  
  db.ref('guilds').once('value', (snapshot) => {
      var guilds = snapshot.val();
      var result = [];
      for (var key in guilds) {
          if (guilds.hasOwnProperty(key)) {
              var guild = guilds[key];
              if (guild.name.search(keyword) != -1)
                  result.push(guild)
          }
      }
      Util.responseHandler(res, true, "Success", result);
  })
});

router.post('/get-details', (req , res) => {
    var guildRef = db.ref('guilds/'+req.body.uid).once('value', (snapshot) => {
    var guild = snapshot.val();
    Util.responseHandler(res, true, "", guild);
  });
});

router.post('/check-user-guild', (req , res) => {
  var userRef = db.ref('users/'+req.body.uid).once('value', (snapshot) => {
    var user = snapshot.val();
    Util.responseHandler(res, true, "", user);
  });
  
});


//****************
router.post('/request', (req, res) => {
    var guild = new Guild();
    Util.copyProps(guild, req.body);

    db.ref('users/' + guild.chief).once('value', (snapshot) => {
        var user = snapshot.val();
        if (user.guildID == "") {
            var guildRef = db.ref('guilds').push(guild, (err) => {
                console.log(err);
                if (err)
                    Util.responseHandler(res, true, err.message);
                else {
                    Util.responseHandler(res, true, "Your guild has been successfully requested");
                }
            })
            db.ref('users/' + req.body.chief).update({ guildID: guildRef.key, isChief: true });
        } else {
            Util.responseHandler(res, true, "You have to leave your guild to create your own guild");
        }
    })
})

router.put('/approve', (req, res) => {
    var guildKey = req.body.key;
    db.ref('guilds/' + guildKey).update({
        status: 'on'
    }, (err) => {
        if (err)
            Util.responseHandler(res, true, err.message);
        else
            Util.responseHandler(res, true, "The guild has been approved");
    });
})

router.post('/request-member', (req, res) => {
    var guildID = req.body.guildID;
    var userID = req.body.userID;

    db.ref('users/' + userID).once('value', (snapshot) => {
        var user = snapshot.val();
        if (user.guildID == "" || user.guildID == undefined) {
            db.ref('guilds/' + guildID).once('value', (snapshot) => {
                var guild = snapshot.val();
                var alreadySent = false;
                if (guild.pendingMembers == undefined){
                  guild.pendingMembers = [];
                }else{
                  var pos;
                  while ((pos = guild.pendingMembers.indexOf(userID)) > -1) {
                      guild.pendingMembers.splice(pos, 1);
                      alreadySent = true;
                  }
                }
                guild.pendingMembers.push(userID);

                db.ref('guilds/' + guildID).update(guild);
                if(alreadySent == true){
                  Util.responseHandler(res, true, "You have already sent request to this guild.");
                }else{
                  Util.responseHandler(res, true, "Request sent Successfully.");
                  db.ref('users/' + guild.chief).once('value', (snapshot) => {
                      var chief = snapshot.val();
                      var guildUrl = global.server_url+"dashboard/guild/guilds/"+guildID;
                      if (chief != null) {
                        var context = {
                          fullname : user.fullname,
                          url : guildUrl
                        };
                        Util.sendMail(chief.email, "Guild request", "guild_request", context);
                        // Util.sendMail(chief.email, "You have got a guild request", `
                        //     You recently have member request from '${user.fullname}'. 
                        //     <a href='${guildUrl}'>Go to your guild</a>
                        // `);
                      }
                  })
                }
                
            })
        } else {
            Util.responseHandler(res, true, "You have to leave your guild to join other guild");
        }
    })
})
// this method is not used
router.post('/invite-member', (req, res) => {
    var guildID = req.body.guildID;
    var userID = req.body.userID;

    db.ref('users/' + userID).once('value', (snapshot) => {
        var user = snapshot.val();
        // if (user.guildID == "" || user.guildID == undefined) {
            if(user.guildInvites == undefined)
                user.guildInvites  = [];
            user.guildInvites.push(guildID);
            db.ref('users/' + userID).update(user)
                .then(r => Util.responseHandler(res, true))
            db.ref('guilds/' + guildID).once('value', (snapshot) => {
                var guild = snapshot.val();
                Util.sendMail(user.email, '', `
                    You have been invited to ${guild.name}
                `)
            })
        // } else {
        //     Util.responseHandler(res, false, "The user has already joined other guild");
        // }
    })
})

router.post('/confirm-member', (req, res) => {
    var guildID = req.body.guildID;
    var userID = req.body.userID;

    db.ref('guilds/' + guildID).once('value', (snapshot) => {
        var guild = snapshot.val();
        if (guild.pendingMembers == undefined)
            guild.pendingMembers = [];
        var pos;
        while ((pos = guild.pendingMembers.indexOf(userID)) > -1) {
            guild.pendingMembers.splice(pos, 1);
        }
        // add the user to joinedMembers array 
        if(guild.joinedMembers == undefined)
            guild.joinedMembers  = [];
        guild.joinedMembers.push(userID);
        
        db.ref('guilds/' + guildID).update(guild);

        db.ref('users/' + userID).once('value', (snapshot) => {
            var user = snapshot.val();
            if(user != null){
              if (user.guildID == "" || user.guildID == undefined) {
                  user.guildID = guildID;
                  user.isChief = false;
                  user.guildInvites = [];
                  db.ref('users/' + userID).update(user)
                      .then(r => {
                          Util.responseHandler(res, true, 'Successfully added to the guild.');
                          var context = {
                            msg : `You have joined "${guild.name}"`,
                          };
                          Util.sendMail(user.email, "Guild Join notification", "guild_join", context);
                          //Util.sendMail(user.email, 'Guild Join notification', `You have joined "${guild.name}"`);
                      })
                      .catch(r => Util.responseHandler(res, true, 'Error while confirming guild member'))
              } else {
                  Util.responseHandler(res, true, "The user already has joined other guild");
              }
            }else{
              Util.responseHandler(res, false, 'User not found');
            }
        })
    })
})

router.post('/reject-member', (req, res) => {
    var guildID = req.body.guildID;
    var userID = req.body.userID;

    db.ref('guilds/' + guildID).once('value', (snapshot) => {
        var guild = snapshot.val();
        if (guild.pendingMembers == undefined)
            guild.pendingMembers = [];
        var pos
        while ((pos = guild.pendingMembers.indexOf(userID)) > -1) {
            guild.pendingMembers.splice(pos, 1);
        }
        db.ref('guilds/' + guildID).update(guild);
        Util.responseHandler(res, true, 'Request rejected Successfully.');
    })
})

router.post('/leave-guild', (req, res) => {
    var uid = req.body.uid;
    var guildID = req.body.guildID;
    db.ref('users/' + uid).once('value', (snapshot) => {
      var user = snapshot.val();
      if(user.guildID == guildID){
        db.ref('users/' + uid).update({guildID: ""})
            .then(r => {
              db.ref('guilds/'+guildID).once('value' , (snapshot) => {
                var guild = snapshot.val();
                if (guild.joinedMembers != undefined){
                  var pos;
                  while ((pos = guild.joinedMembers.indexOf(uid)) > -1) {
                      guild.joinedMembers.splice(pos, 1);
                  }
                }
                db.ref('guilds/' + guildID).update(guild);
                Util.responseHandler(res, true, "You left guild");
              })
            })
            .catch(r => Util.responseHandler(res, true, "Error while leaving guild"))
      }else{
        Util.responseHandler(res, true, "You are not associated with this guild.")
      }
    });
})

module.exports = router;