/*
*Author: Neil Acharya
*Using code from <link>https://github.com/amzn/alexa-skills-kit-js</link>
*/


/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');


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
};

TestReview.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("TestReview onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

TestReview.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("TestReview onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

TestReview.prototype.intentHandlers = {

};



// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the TestReview skill.
    var helloWorld = new TestReview();
    helloWorld.execute(event, context);
};