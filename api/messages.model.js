var general = require("./general.js");

////////////////////////
// MESSAGE PARAMETERS //
////////////////////////

var DISTRIBUTIONS = {
    "student": {
        "WILL_MESSAGE": [[0.8, true],[0.2, false]],
        "TOTAL": [15, 2, 1, 50],
        "FOR_WORLD": [[0.1, true],[0.9, false]],
        "SUBJECT": [8, 2, 1, 20],
        "BODY": [200, 100, 10, 1000]
    },
    "lecturer": {
        "WILL_MESSAGE": [[0.6, true],[0.4, false]],
        "TOTAL": [15, 2, 1, 50],
        "FOR_WORLD": [[0.5, true],[0.5, false]],
        "SUBJECT": [8, 2, 1, 20],
        "BODY": [300, 200, 10, 2000]
    },
    "researcher": {
        "WILL_MESSAGE": [[0.3, true],[0.7, false]],
        "TOTAL": [5, 1, 0, 30],
        "FOR_WORLD": [[0.3, true],[0.7, false]],
        "SUBJECT": [8, 2, 1, 20],
        "BODY": [300, 150, 10, 3000]
    }
};


///////////////////
// MESSAGE MODEL //
///////////////////

exports.generateMessages = function(worlds, users) {
    var messages = [];

    // Determine target number of messages for each user
    for (var u = 0; u < users.length; u++) {
        var muser = users[u];
        var willMessage = general.randomize(DISTRIBUTIONS[muser.userType].WILL_MESSAGE);
        var targetMessages = general.ASM(DISTRIBUTIONS[muser.userType].TOTAL);
        var forWorld = general.randomize(DISTRIBUTIONS[muser.userType].FOR_WORLD);

        if (willMessage) {
            // Determine how many messages to send
            var forUser = Math.round((1 - forWorld) * targetMessages);
            var forWorld = Math.round(forWorld * targetMessages);

            for (i = 0; i < forWorld; i++) {
                // select a random world to message
                var worldToMessage = worlds[Math.floor(Math.random() * worlds.length)];
                messages.push(new exports.Message(muser, worldToMessage.id));
            }
            for (i = 0; i < forUser; i++) {
                // select a random user to message
                var userToMessage = users[Math.floor(Math.random() * users.length)];
                messages.push(new exports.Message(muser, userToMessage.userid));
            }
        }
    }

    return messages;
};

exports.Message = function(fromUser, toId) {
    var that = {};

    that.from = fromUser.userid;
    that.to = toId;
    that.subject = general.generateKeywords(general.ASM(DISTRIBUTIONS[fromUser.userType].SUBJECT)).join(" ");
    that.subject = that.subject[0].toUpperCase() + that.subject.substring(1);
    that.body = general.generateSentence(general.ASM(DISTRIBUTIONS[fromUser.userType].BODY));

    return that;
};
