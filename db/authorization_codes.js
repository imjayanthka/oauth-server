'use strict';
const admin = require('../config/admin');
var db = admin.database()
var refString = 'authorizationCodes'


module.exports.find = (key, done) => {
    var ref = db.ref(refString + '/'+ key)
    ref.on('value', function(snapshot){
        return done(null, snapshot.val())
    }, function(err){
        return done(err)
    })
}

module.exports.save = (code, clientId, redirectUri, userId, done) => {
    console.log('Log it called')
    var ref = db.ref(refString)
    ref.child(code).set({
        clientId: clientId,
        redirectUri: redirectUri,
        userId: userId
    })
    return done(null)
}