'use strict';
const admin = require('./admin');
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
    var ref = db.ref(refString)
    console.log(clientId, redirectUri, userId)
    console.log('-------------------------------')
    ref.child(code).set({
        clientId: clientId,
        redirectUri: redirectUri,
        userId: userId
    })
    done()
}