var general = require("./general.js");

////////////////////////
// MESSAGE PARAMETERS //
////////////////////////


var DISTRIBUTIONS = {
    "simple-group": {
        "TOTAL": [2, 0, 1, 5],
        "TITLE": [2, 1, 1, 15],
        "HAS_DESCRIPTION": [[0.4, true], [0.6, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "BODY": [300, 150, 10, 3000]
    },
    "math-course": {
        "TOTAL": [2, 0, 1, 5],
        "TITLE": [2, 1, 1, 15],
        "HAS_DESCRIPTION": [[0.7, true], [0.3, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "BODY": [300, 150, 10, 3000]
    },
    "basic-course": {
        "TOTAL": [2, 0, 1, 5],
        "TITLE": [2, 1, 1, 15],
        "HAS_DESCRIPTION": [[0.6, true], [0.4, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "BODY": [300, 150, 10, 3000]
    },
    "research-project": {
        "TOTAL": [2, 0, 1, 5],
        "TITLE": [2, 1, 1, 15],
        "HAS_DESCRIPTION": [[0.75, true], [0.25, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "BODY": [300, 150, 10, 3000]
    },
    "research-support": {
        "TOTAL": [2, 0, 1, 5],
        "TITLE": [2, 1, 1, 15],
        "HAS_DESCRIPTION": [[0.7, true], [0.3, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "BODY": [300, 150, 10, 3000]
    }
};


///////////////////
// MESSAGE MODEL //
///////////////////

exports.generateAreas = function(worlds) {
    var areas = [];

    // Determine target number of areas for each world
    for (var w = 0; w < worlds.length; w++) {
        var aworld = worlds[w];
        targetAreas = general.ASM(DISTRIBUTIONS[aworld.template].TOTAL);

        for (i = 0; i < targetAreas; i++) {
            areas.push(new exports.Area(aworld));
        }
    }

    return areas;
};

exports.Area = function(world){
    var that = {};

    that.worldId = world.id;
    that.title = general.generateKeywords(general.ASM(DISTRIBUTIONS[world.template].TITLE)).join(" ");
    that.title = that.title[0].toUpperCase() + that.title.substring(1);
    that.hasDescription = general.randomize(DISTRIBUTIONS[world.template].HAS_DESCRIPTION);
    that.description = general.generateSentence(general.ASM(DISTRIBUTIONS[world.template].DESCRIPTION));
    that.body = general.generateSentence(general.ASM(DISTRIBUTIONS[world.template].BODY));

    return that;
};
