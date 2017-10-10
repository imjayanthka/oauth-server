'use strict';
const admin = require('../config/admin');
var auth = admin.auth()
var db = admin.database()
var refString = 'accessTokens'


module.exports.createCustomToken = (id, done) => {
    auth.createCustomToken(id)
        .then(function (customToken) {
            // Send token back to client
            return done(null, customToken)
        })
        .catch(function (error) {
            return done(error)
        })
}

module.exports.find = (key, done) => {
    var ref = db.ref(refString)
    ref.orderByKey().equalTo(key).on('value', function(snapshot){
         return done(null, snapshot.val())
    }, function(err){
         return done(new Error('Token not found'))
    })
}

module.exports.findByUserIdAndClientId = (userId, clientId, done) => {
    console.log(userId)
    console.log(clientId)
    console.log('++++++++++++++++++++++++++++++++++++++++++++')
    var ref = db.ref(refString)
    ref.on("value", function (snapshot) {
        if(snapshot.val()){
            //Snapshots exsits
            let token;
            snapshot.forEach(function(item){
                console.log(item.key)
                if(item.val().clientId === clientId && item.val().userId === userId){
                    console.log('*********=================*************')
                    return done(null, item.val().accessToken, item.key)
                } else {
                    console.log('*********-----------------*************')
                    return done(new Error('Token Not Found'))
                }
            })
        } else {
            //no snapshots
            console.log('*********+++++No access token++++++++*************')
            return done(new Error('Token Not Found'))
        }
    }, function(error){
        console.log('**********************')
        return done(new Error('Token Not Found'))
    });
};


module.exports.updateAccessToken = (key, oAccessToken, newAccessToken, expirationDate, userId, clientId, done) => {
    var data = {
        accessToken: newAccessToken,
        expirationDate: expirationDate,
        clientId: clientId,
        userId: userId  
    }
    var ref = db.ref(refString+'/'+key)
    ref.set(data, function(error){
        if(error) done(error)
        return done(null)
    })
}


module.exports.save = (token, expirationDate, userId, clientId, done) => {
    var ref = db.ref(refString)
    ref.push({
        accessToken: token,
        expirationDate: expirationDate,
        clientId: clientId,
        userId: userId
    })
    return done(null)
}