/*
*Author: Neil Acharya
*Using code from <link>https://github.com/amzn/alexa-skills-kit-js</link>
*/

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var KEY_TITLE_SET = "title";
var makeNewSet = "newSet";
var itemList = "items";
/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var db = require('./storage');

var TestReview = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TestReview.prototype = Object.create(AlexaSkill.prototype);
TestReview.prototype.constructor = TestReview;

TestReview.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("TestReview onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
    session.attributes[itemList] = "[]";
};

TestReview.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("TestReview onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can make a review or go over a previous one";
    var repromptText = "you can make a review or go over a previous one";
    response.ask(speechOutput, repromptText);
};

TestReview.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("TestReview onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};


//INTENT HANDLERS HERE
TestReview.prototype.intentHandlers = {
    CreateSetIntent: function(intent, session, response) {
        var speechOutput = "Okay, what's the title of this review set?";
        var repromptText = "what's the title of this review set?";
        session.attributes[makeNewSet] = true;
        response.ask(speechOutput, repromptText);
    },
    PreviousSetIntent: function(intent, session, response) {
        db.getReviewSets(session).then((lists) => {
            if (!lists) {
                var speechOutput = "Sorry, I couldn't find any review sets on your account";
                response.tell(speechOutput);
                return;
            }
            session.attributes[makeNewSet] = false;
            var tellResponse = "Here are the lists I found:" + lists.map((item) => item.name).join(', ');
            var repromptText = "Which list would you like to review";
            response.ask(tellResponse, repromptText);
        });
    },
    ExamSetRecording: function(intent, session, response) {
        var listItem = intent.slots.remember;
        if (!session.attributes[makeNewSet]) {
            var speechOutput = "You haven't decided to make a set, so I can't complete your request.";
            response.tell(speechOutput);
            return;
        } if (!session.attributes[KEY_TITLE_SET]) {
            var speechOutput = "You haven't specified a title for this set yet.";
            response.tell(speechOutput);
            return;
        }
        var tempJson = JSON.parse(session.attributes[itemList]);
        tempJson.push(listItem.value);
        session.attributes[itemList] = JSON.stringify(tempJson);

        response.ask('','');
    },
    CompleteRecording: function(intent, session, response) {
        if (!session.attributes[makeNewSet]) {
            var speechOutput = "You haven't decided to make a set, so I can't complete your request.";
            response.tell(speechOutput);
            return;
        } if (!session.attributes[KEY_TITLE_SET]) {
            var speechOutput = "You haven't specified a title for this set yet.";
            response.tell(speechOutput);
            return;
        }
        var tempJson = JSON.parse(session.attributes[itemList]);

        //if (list.isEmpty()) {
        if (tempJson.isEmpty()) {
            var speechOutput = "There are no items in your review set";
            response.tell(speechOutput);
            return;
        }

        storage.saveReviewSet(session, session.attributes[itemList]).then(function(resp) {
            console.log(resp);
            var speechOutput = "Okay, your set is saved";
            response.tell(speechOutput);
        });

    },
    TitleIntent: function(intent, session, response) {
        var titleSlot = intent.slots.title;
        session.attributes[KEY_TITLE_SET] = titleSlot.value.replace(/\.\s*/g, '').toLowerCase();
        if (session.attributes[makeNewSet]) {
            var speechText = "Okay, the set is now named " + titleSlot.value + ". Please start your review set by saying <break time=\"0.2s\"/> Remember blank";
            var repromptText = "Please start your review set by saying <break time=\"0.2s\"/>" +
             "Remember blank";
            var speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            }
            var repromptOutput = {
                speech: repromptText,
                type: AlexaSkill.speechOutputType.SSML
            }
            response.ask(speechOutput, repromptOutput);
        } else {
            db.getReviewSet(session).then((itemsOnList) => {
                if (!itemsOnList) {
                    var speechOutput = "Sorry, this review set is empty or doesn't exist";
                    response.tell(speechOutput);
                    return;
                }
                var tellResponse = "Remember " + itemsOnList.map((item) => item.name).join('<break time = \"0.3s\"/>Remember, ');
                //var repromptText = "Which list would you like to review";
                var tellObj = {
                    speech:  tellResponse,
                    type: AlexaSkill.speechOutputType.SSML
                }
                response.tell(tellObj);
            });
        }
    },
    ListSets: function(intent, session, response) {
         db.getReviewSets(session).then((lists) => {
            if (!lists) {
                var speechOutput = "Sorry, I couldn't find any review sets on your account";
                response.tell(speechOutput);
                return;
            }
            session.attributes[makeNewSet] = false;
            var tellResponse = "Here are the lists I found:" + lists.map((item) => item.name).join(', ');
            var repromptText = "Which list would you like to review";
            response.ask(tellResponse, repromptText);
        });
    }
};



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the TestReview skill.
    var helloWorld = new TestReview();
    helloWorld.execute(event, context);
};