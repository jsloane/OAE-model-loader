var general = require("./general.js");

//////////////////
// CONTACTS API //
//////////////////

exports.loadMessage = function(message, users, SERVER_URL, ADMIN_PASSWORD, callback) {
    // Get user objects
    var fromUser = false;
    var toUser = false;
    for (var u = 0; u < users.length; u++) {
        if (users[u].userid === message.fromId) {
            fromUser = users[u];
        }
        if (users[u].userid === message.toId) {
            toUser = users[u];
        }
    }
    // Send the message
    sendMessage(message, fromUser, toUser, SERVER_URL, ADMIN_PASSWORD, callback);
};

var sendMessage = function(message, fromUser, toUser, SERVER_URL, ADMIN_PASSWORD, callback) {
    var auth = fromUser.userid + ":" + fromUser.password;
    var messageParams = {
        "_charset_": "utf-8",
        "sakai:body":  message.body,
        "sakai:category": "message",
        "sakai:from": fromUser.userid,
        "sakai:messagebox": "outbox",
        "sakai:sendstate": "pending",
        "sakai:subject": message.subject,
        "sakai:to": "internal:" + toUser.userid,
        "sakai:type":  "internal"
    };
    general.urlReq(SERVER_URL + "/~" + fromUser.userid + "/message.create.html", {
        method: 'POST',
        params: messageParams,
        auth: auth
    }, callback);
};
