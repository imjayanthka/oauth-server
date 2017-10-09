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
            console.log("Error creating custom token:", error);
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
    ref.equalTo(userId).on("value", function (snapshot) {
        console.log(snapshot.val())
        if(snapshot.val()){
            //Snapshots exsits
            let token;
            snapshot.forEach(function(item){
                console.log(item)
                if(item.clientId === clientId){
                    console.log('*********=================*************')
                    done(null, item.accessToken)
                } else {
                    console.log('*********-----------------*************')
                    done(new Error('Token Not Found'))
                }
            })
        } else {
            //no snapshots
            console.log('*********+++++++++++++*************')
            done(new Error('Token Not Found'))
        }
    }, function(error){
        console.log('**********************')
        done(new Error('Token Not Found'))
    });
};


module.exports.updateAccessToken = (oAccessToken, newAccessToken, expirationDate, userId, clientId, done) => {
    var ref = db.ref(refString)
    ref.orderByKey().equalTo(oAccessToken).remove()
    ref.push({
        accessToken: newAccessToken,
        expirationDate: expirationDate,
        clientId: clientId,
        userId: userId 
    })
    done()
}


module.exports.save = (token, expirationDate, userId, clientId, done) => {
    var ref = db.ref(refString)
    ref.push({
        accessToken: token,
        expirationDate: expirationDate,
        clientId: clientId,
        userId: userId
    })
    done()
}