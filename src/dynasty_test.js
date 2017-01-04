
var storage = require('./storage')();

var session = { user: {userId: "test"},
                attributes: {
                    'title': "TestTitle"
                }};
var item = '[\"Test item\"]';

// storage.saveReviewSet(session, item).then((resp)=>{
//     console.log("it worked");
//     console.log(resp);
// }, (err)=>{
//     console.log("it didnt work");
//     console.log(err);
// });

storage.getReviewSet(session).then((item)=>{
    console.log(item);
});