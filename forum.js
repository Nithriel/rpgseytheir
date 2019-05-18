const express = require('express');
const utils = require('./utils');
const pass = require('./passport.js');

var router = express.Router();

router.use(pass);

// Add post to the db
router.post('/:genre/add_post', add_post);
router.post('/:genre/add_character', add_character);
router.post('/add_reply', add_reply);
router.post('/delete_post', delete_post);
router.post('/edit_post', edit_post);
router.post('/edit_character', edit_character);
router.get('/clearnotification', clearNotification);

function get_date() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    current_date = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return current_date;
}

function add_post(request, response) {
    var title = request.body.title;
    var message = request.body.message;
    var username = request.user.username;
    var chosen_genre = request.params.genre;

    var db = utils.getDb();

    db.collection('messages').insertOne({
        title: title,
        message: message,
        username: username,
        type: 'thread',
        date: get_date(),
        thread_id: null,
        genre: chosen_genre
    }, (err, result) => {
        if (err) {
            response.send('Unable to post message');
        }
        response.redirect('/genre_board/' + chosen_genre);
    });
}

function add_character(request, response) {
    var title = request.body.name;
    var buffs = [request.body.buff1, request.body.buff2, request.body.buff3, request.body.buff4 ,request.body.buff5];
    var debuffs = [request.body.debuff1, request.body.debuff2, request.body.debuff3, request.body.debuff4, request.body.debuff5];
    var status = request.body.char_status;
    var inventory = request.body.inventory;
    var skills = request.body.skills;
    var personal_sheet = request.body.personal_sheet;
    var look = request.body.look;
    var personality = request.body.personality;
    var personal_personality = request.body.personality;
    var story = request.body.story;
    var personal_story = request.body.personal_story;
    var username = request.user.username;
    var chosen_genre = request.params.genre;

    var db = utils.getDb();

    db.collection('messages').insertOne({
        title: title,
        message: title,
        buffs: buffs,
        debuffs: debuffs,
        status: status,
        inventory: inventory,
        skills: skills,
        personal_sheet: personal_sheet,
        look: look,
        personality: personality,
        personal_personality: personal_personality,
        story: story,
        personal_story: personal_story,
        username: username,
        type: 'character',
        date: get_date(),
        thread_id: null,
        genre: chosen_genre
    }, (err, result) => {
        if (err) {
            response.send('Unable to post message');
        }
        response.redirect('/genre_board/' + chosen_genre);
    });
}

function edit_character(request, response) {
    var ObjectId = utils.getObjectId();

    var buffs = [request.body.buff1, request.body.buff2, request.body.buff3, request.body.buff4 ,request.body.buff5];
    var debuffs = [request.body.debuff1, request.body.debuff2, request.body.debuff3, request.body.debuff4, request.body.debuff5];
    var status = request.body.char_status;
    var inventory = request.body.inventory;
    var skills = request.body.skills;
    var personal_sheet = request.body.personal_sheet;
    var look = request.body.look;
    var personality = request.body.personality;
    var personal_personality = request.body.personality;
    var story = request.body.story;
    var personal_story = request.body.personal_story;
    var id = ObjectId(request.body.id);

    var db = utils.getDb();

    db.collection('messages').findOneAndUpdate({
        _id: id
    }, {
        $set: {
            buffs: buffs,
            debuffs: debuffs,
            status: status,
            inventory: inventory,
            skills: skills,
            personal_sheet: personal_sheet,
            look: look,
            personality: personality,
            personal_personality: personal_personality,
            story: story,
            personal_story: personal_story,
        }
    }, (err, items) => {
        if (err) {
            response.send('error in updating the character')
        }
        response.redirect('back')
    });
}

function edit_post(request, response) {
    var thread_id = request.body.id;
    var edited_message = request.body.edit_textarea;
    
    var db = utils.getDb();
    var ObjectId = utils.getObjectId();
    
    db.collection('messages').findOneAndUpdate({
        _id: new ObjectId(thread_id)
    }, {
        $set: {message: edited_message}
    }, (err, result) => {
        if (err) {
            response.send('Unable to edit message');
        }
        response.redirect('/');
    });
}

function delete_post(request, response) {
    var thread_id = request.body.id;
    var username = request.user.username;

    var db = utils.getDb();
    var ObjectId = utils.getObjectId();

    db.collection('messages').deleteMany({
        $or:[
            {_id: ObjectId(thread_id)},
            {thread_id: thread_id}
        ]
    }, (err, result) => {
        if (err) {
            response.send('Unable to delete message');
        }
        response.redirect('/');
    });
}

function add_reply(request, response) {
    var reply = request.body.reply;
    var username = request.user.username;
    var thread_id = request.body.id;

    var db = utils.getDb();

    db.collection('messages').insertOne({
        message: reply,
        username: username,
        type: 'reply',
        date: get_date(),
        thread_id: thread_id
    }, (err, result) => {
        if (err) {
            response.send('Unable to post message');
        }
        addNotification(thread_id);
        response.redirect('back');
    });
}

async function addNotification(thread_id) {
    var db = utils.getDb();
    var ObjectId = utils.getObjectId();
    var thread = await db.collection('messages').findOne({
        _id: ObjectId(thread_id)
    });
    var user = thread.username;
    var dbuser = await db.collection('users').findOne({
        username: user
    });
    var notifications = dbuser.notification;
    notifications.unshift(thread);
    db.collection('users').findOneAndUpdate({
        username: user
    }, {
        $set: {notification: notifications}
    }, (err, items) => {})
}

function clearNotification(request, response) {
    var db = utils.getDb();
    var username = request.user.username;
    db.collection('users').findOneAndUpdate({
        username: username
    }, {
        $set: {notification: []}
    }, (err, items) => {});
    response.redirect('back')
}

module.exports = router;