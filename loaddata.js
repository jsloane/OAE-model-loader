var general = require("./api/general.js");
var userAPI = require("./api/user.api.js");
var contactAPI = require("./api/contacts.api.js");
var worldAPI = require("./api/world.api.js");
var messageAPI = require("./api/message.api.js");
var runSuites = require("./run_suites.js");

//////////////////////////////////////
// OVERALL CONFIGURATION PARAMETERS //
//////////////////////////////////////

var SCRIPT_FOLDER = "scripts";

if (process.argv.length !== 7){
    throw new Error("Please run this program in the following way: node loaddata.js <NUMBER OF BATCHES TO LOAD> <SERVER_URL> <ADMIN PASSWORD> <NUMBER_OF_CONCURRENT_BATCHES> <BATCH_INTERVAL_FOR_TEST_SUITE/0 for no suites>");
}

var BATCHES = parseInt(process.argv[2], 10);
var SERVER_URL = process.argv[3];
var ADMIN_PASSWORD = process.argv[4];
var CONCURRENT_BATCHES = parseInt(process.argv[5], 10);
var RUN_SUITES = parseInt(process.argv[6], 10);
if (RUN_SUITES){
    runSuites.clearResults();
}

//////////////////////
// CLEAN PARAMETERS //
//////////////////////

// clear trailing slashes from server url
SERVER_URL = SERVER_URL.replace(/^(.*?)\/+$/, "$1");

////////////////////
// KICK OFF BATCH //
////////////////////

var currentBatch = -1;
var batches = [];

var loadNextBatch = function(){
    currentBatch++;
    if (currentBatch < BATCHES){
        console.log("Loading Batch " + currentBatch);
        // Load the data from the model
        var users = general.loadJSONFileIntoArray("./" + SCRIPT_FOLDER + "/users/" + currentBatch + ".txt");
        var contacts = general.loadJSONFileIntoArray("./" + SCRIPT_FOLDER + "/contacts/" + currentBatch + ".txt");
        var worlds = general.loadJSONFileIntoArray("./" + SCRIPT_FOLDER + "/worlds/" + currentBatch + ".txt");
        var messages = general.loadJSONFileIntoArray("./" + SCRIPT_FOLDER + "/messages/" + currentBatch + ".txt");
        batches.push({
            "users": users,
            "contacts": contacts,
            "worlds": worlds,
            "messages": messages
        });
        loadUsers(users, contacts, worlds, messages);
    } else {
        console.log("*****************************");
        console.log("Finished generating " + BATCHES + " batches");
        console.log("Requests made: " + general.requests);
        console.log("Request errors: " + general.errors);
    }
};

var finishBatch = function(){
    console.log("Finished Loading Batch " + currentBatch);
    console.log("=================================");
    loadNextBatch();
};

var checkRunSuites = function(){
    if (RUN_SUITES && currentBatch % RUN_SUITES === 0){
        // run the test suite before continuing
        runSuites.runSuites(batches, currentBatch - 1, SERVER_URL, finishBatch);
    } else {
        finishBatch();
    }
};

///////////
// USERS //
///////////

var loadUsers = function(users, contacts, worlds){
    var currentUser = -1;
    var loadNextUser = function(){
        console.log("  Finished Loading User " + (currentUser + 1) + " of " + users.length);
        currentUser++;
        if (currentUser < users.length){
            var nextUser = users[currentUser];
            userAPI.loadUser(nextUser, SERVER_URL, ADMIN_PASSWORD, loadNextUser);
        } else {
            loadContacts(users, contacts, worlds, messages);
        }
    };
    loadNextUser();
};

//////////////
// CONTACTS //
//////////////

var loadContacts = function(users, contacts, worlds, messages){
    var currentContact = -1;
    var loadNextContact = function(){
        console.log("  Finished Loading Contact " + (currentContact + 1) + " of " + contacts.length);
        currentContact++;
        if (currentContact < contacts.length){
            var nextContact = contacts[currentContact];
            contactAPI.loadContact(nextContact, users, SERVER_URL, ADMIN_PASSWORD, loadNextContact);
        } else {
            loadWorlds(users, worlds, messages);
        }
    };
    loadNextContact();
};

////////////
// WORLDS //
////////////

var loadWorlds = function(users, worlds, messages){
    var currentWorld = -1;
    var loadNextWorld = function(){
        console.log("  Finished Loading World " + (currentWorld + 1) + " of " + worlds.length);
        currentWorld++;
        if (currentWorld < worlds.length){
            var nextWorld = worlds[currentWorld];
            worldAPI.loadWorld(nextWorld, users, SERVER_URL, ADMIN_PASSWORD, loadNextWorld);
        } else {
            loadWorldGroupMemberships(users, worlds, messages);
        }
    };
    loadNextWorld();
};

var loadWorldGroupMemberships = function(users, worlds, messages){
    var currentWorldGroupMembership = -1;
    var loadNextWorldGroupMembership = function(){
        console.log("  Finished Loading Group Memberships " + (currentWorldGroupMembership + 1) + " of " + worlds.length);
        currentWorldGroupMembership++;
        if (currentWorldGroupMembership < worlds.length){
            var nextWorld = worlds[currentWorldGroupMembership];
            worldAPI.loadGroupMembership(nextWorld, users, SERVER_URL, ADMIN_PASSWORD, loadNextWorldGroupMembership);
        } else {
            loadMessages(users, worlds, messages);
        }
    };
    loadNextWorldGroupMembership();
};

var loadMessages = function(users, worlds, messages){
    var currentMessage = -1;
    var loadNextMessages = function(){
        console.log("  Finished Loading Messages " + (currentMessage + 1) + " of " + messages.length);
        currentMessage++;
        if (currentWorldGroupMembership < worlds.length){
            var nextMessage = messages[currentMessage];
            messageAPI.loadGroupMembership(nextMessage, users, SERVER_URL, ADMIN_PASSWORD, loadNextMessages);
        } else {
            checkRunSuites();
        }
    };
    loadNextMessages();
};

///////////
// START //
///////////

for (var b = 0; b < CONCURRENT_BATCHES && b < BATCHES; b++){
    loadNextBatch();
}