//var AWS = require("aws-sdk");

var credentials = {
    accessKeyId: process.env.TEST_USER_ID,
    secretAccessKey: process.env.TEST_USER_SECRET
};

var dynasty = require('dynasty')(credentials);

var storage = function () {
    'use strict';
    var reviewSetTable = dynasty.table('ReviewSets');
    return {
        getReviewSets: function (session) {
            var p = new Promise(function (resolve, reject) {
                reviewSetTable.findAll(session.user.userId).then(function (resp) {
                    console.log(resp);
                    resolve(resp);
                }).catch(function (err) {
                    reject(err);
                });
            });
            return p;
        },
        getReviewSet: function (session) {
            var p = new Promise(function (resolve, reject) {
                reviewSetTable.find({hash: session.user.userId, range: session.attributes['title']})
                .then(function (sets) {
                    resolve(sets);
                })
                .catch((err)=>{
                    reject(err);
                });
            });
            return p;
        },
        saveReviewSet: function (session, item) {
            var p = new Promise(function (resolve, reject) {
                reviewSetTable.insert({
                    userId: session.user.userId,
                    title: session.attributes["title"],
                    Data: item
                }).then(function (resp) {
                    console.log(resp);
                    resolve(resp);
                }).catch(function (err) {
                    reject(err);
                });
            });
            return p;
        }
    };
};
module.exports = storage;