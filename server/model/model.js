'use strict'
class Account {
    constructor() {
        this.uid = "";
        this.fullname = "";
        this.email = "";
        this.password = [];
        this.photoUrl = "/assets/gravatar/default.jpg";
        this.joinDate = new Date();
        this.credential_provider = "";
        this.locked = false;
        this.isAdmin = false;
        this.following = [];
        this.followed = [];
        this.guildID = "";
        this.brewbook = [];
        this.isChief = false;
        this.guildInvites = [];
    }
};

class Guild {
    constructor() {
        this.id = "";
        this.name = "";
        this.createdDate = new Date();
        this.description = "";
        this.logo = "";
        this.logo_full = "";
        this.chief = "";
        this.status = "pending";
        this.pendingMembers = [];
    }
}

class Recipe {
    constructor() {
        this.name = "";
        this.status = "pending";
    }
}

class Message {
    constructor() {
        this.sender = "";
        this.receiver = "";
        this.subject = "";
        this.message = "";
        this.read = false;
    }
}

module.exports = {
    Account: Account,
    Guild: Guild,
    Recipe: Recipe,
    Message: Message
}
