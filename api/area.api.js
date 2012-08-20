var general = require("./general.js");
var userAPI = require("./user.api.js");

//////////////////
// AREA API //
//////////////////

exports.loadArea = function(area, worlds, users, SERVER_URL, ADMIN_PASSWORD, callback){
    // Get world object
    var world = false;
    for (var w = 0; w < worlds.length; u++) {
        if (worlds[w].id === area.worldId){
            targetWorld = worlds[w];
        }
    }

    // Add area to the world
    addArea(area, world, users, SERVER_URL, ADMIN_PASSWORD, callback);
};

var addArea = function(area, world, users, SERVER_URL, ADMIN_PASSWORD, callback){
    var auth = world.creator + ":" + userAPI.getUser(world.creator, users).password;
    var refId = "id" + Math.random();

    var description = "";
    if (area.hasDescription) {
        description = area.description;
    }

    var docParams = {
        "mimeType": "x-sakai/document",
        "sakai:copyright": "creativecommons",
        "sakai:description": description,
        "sakai:permissions": "public",
        "sakai:pooled-content-file-name": area.title,
        "sakai:schemaversion": "2",
        "structure0": {
            "test-doc": {
                "_title": area.title,
                "_order": 0,
                "_ref": refId,
                "_nonEditable": false,
                "main": {
                    "_title": area.title,
                    "_order": 0,
                    "_ref": refId,
                    "_nonEditable": false
                }
            }
        }
    };

    var toCreate = {};
    toCreate[refId] = {
        "rows": {
            "__array__0__": {
                "id":"id5663434",
                "columns": {
                    "__array__0__": {
                        "width":1,
                        "elements":""
                    }
                }
            }
        }
    };

    general.urlReq(SERVER_URL + "/system/pool/createfile", {
        method: 'POST',
        params: {data: JSON.stringify(docParams)},
        auth: auth
    }, function(res, success){
        var poolId = res._contentItem.poolId;
        var struct = JSON.parse(res._contentItem.item.structure0);
        var itemURLName = '';
        if (docStructure.length === 1) {
            for (itemURLName in struct) {
                if (struct.hasOwnProperty(itemURLName)) {
                    break;
                }
            }
        } else {
            itemURLName = area.title;
        }
        var batchRequests = [];
        $.each(struct, function(i, obj) {
            batchRequests.push({
                url: '/p/' + poolId + '/' + obj._ref + '.save.json',
                method: 'POST',
                parameters: {
                    'sling:resourceType': 'sakai/pagecontent',
                    'sakai:pagecontent': JSON.stringify(toCreate[obj._ref]),
                    '_charset_': 'utf-8'
                }
            });
        });

        var postData = {
            ':operation': 'import',
            ':contentType': 'json',
            ':merge': false,
            ':replace': true,
            ':replaceProperties': true,
            '_charset_':'utf-8'
        };
        postData[':content'] = JSON.stringify(toCreate);

        general.urlReq('/p/' + poolId, {
            method: 'POST',
            dataType: 'text',
            data: postData,
            auth: auth
        }, function(res, success){
            var requestString = JSON.stringify(batchRequests);
            general.urlReq('/system/batch', {
                method: 'POST',
                data: {
                    '_charset_':'utf-8',
                    'requests': requestString
                },
                auth: auth
            }, function(res, success){
                //callback(poolId, itemURLName);
                callback();
            });
        });
    });
};