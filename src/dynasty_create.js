var credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

var dynasty = require('dynasty')(credentials, 'http://localhost:8000');

dynasty.create('ReviewSets',{key_schema: {
    hash: ['userId', 'string'],
    range: ['title', 'string']
}}).then((resp)=>{
    console.log(resp);
    console.log("it worked");
}).catch((err)=>{
    console.log(err);
})