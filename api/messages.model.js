var general = require("./general.js");

////////////////////////
// MESSAGE PARAMETERS //
////////////////////////

var DISTRIBUTIONS = {
    "student": {
        "WILL_MESSAGE": [[0.8, true],[0.2, false]],
        "TOTAL": [15, 10, 1, 50],
        "FOR_WORLD": [0, 0.15, 0.05, 0.1]
    },
    "lecturer": {
        "WILL_MESSAGE": [[0.6, true],[0.4, false]],
        "TOTAL": [15, 10, 1, 50],
        "FOR_WORLD": [0.1, 0.5, 0.25, 0.6]
    },
    "researcher": {
        "WILL_MESSAGE": [[0.3, true],[0.7, false]],
        "TOTAL": [15, 10, 1, 50],
        "FOR_WORLD": [0, 0.15, 0.05, 0.1]
    }
};


///////////////////
// MESSAGE MODEL //
///////////////////

exports.generateMessages = function(worlds, users) {
    var messages = [];

    // Determine target number of messages for each user
    for (var u = 0; u < users.length; u++){
        var user = users[u];
        user.willMessage = general.randomize(DISTRIBUTIONS[user.userType].WILL_MESSAGE);
        user.targetMessages = general.ASM(DISTRIBUTIONS[user.userType].TOTAL);
        user.forWorld = general.ASM(DISTRIBUTIONS[user.userType].FOR_WORLD);
    }

    for (var s = 0; s < users.length; s++){
        var muser = users[s];
        if (muser.willMessage) {
            // Determine how many messages to send
            var forUser = Math.round((1 - muser.forWorld) * muser.targetMessages);
            var forWorld = Math.round(muser.forWorld * muser.targetMessages);

            for (i = 0; i < forWorld; i++) {
                var worldToMessage = worlds[Math.floor(Math.random() * worlds.length)];
                messages.push(new exports.Message(muser, worldToMessage.id));
            }
            for (i = 0; i < forUser; i++) {
                var userToMessage = users[Math.floor(Math.random() * users.length)];
                messages.push(new exports.Message(muser, userToMessage.userid));
            }
        }
    }

    return messages;
};

exports.Message = function(fromUser, toId){
    var that = {};

    that.from = fromUser.userid;
    that.to = toId;
    that.subject = "gday mate";
    that.body = "Lets put another shrimp on the barbie!";

    return that;
};
