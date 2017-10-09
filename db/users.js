'use strict';
const admin = require('../config/admin');
var db = admin.database()


module.exports.findById = (id, done) => {
  admin.auth().getUser(id)
    .then(function(user){
        // console.log(user)
        return done(null, user);
    })
    .catch(function(error){
        console.log('Errror: finding user')
        return done(new Error('User Not Found'));
    })
};

module.exports.findByUsername = (username, done) => {
    admin.auth().getUserByEmail(username)
        .then(function (user) {
            return done(null, user);
        })
        .catch(function (error) {
            return done(new Error('User Not Found'));
        })
};

