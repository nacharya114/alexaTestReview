//var AWS = require("aws-sdk");

var credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

var dynasty = require('dynasty')(credentials, 'localhost:8000');

var storage = (function () {
    'use strict';
    var reviewSetTable = dynasty.table('ReviewSets');
    return {
        getReviewSets: function(session) {
            var p = new Promise((resolve, reject) =>{
                reviewSetTable.finaAll(session.user.userId).then(function(resp){
                    console.log(resp);
                    resolve(resp);
                }).catch(function(err){
                    reject(err);
                });
            });
            return p;
        },
        getReviewSet: function(session) {
            var p = new Promise((resolve, reject)=>{
                reviewSetTable.batchFind([{hash: session.user.userId, range: session.attributes['title']}])
                .then(function(sets){
                    resolve(sets);
                });
            });
            return p;
        },
        saveReviewSet: function(session, item) {
            var p = new Promise((resolve, reject)=>{
                reviewSetTable.insert({
                    userId: session.user.userId,
                    title: session.attributes["title"],
                    Data: item
                }).then((resp)=>{
                    resolve();
                });
            });
            return p;
        }
    };
})();
module.exports = storage;