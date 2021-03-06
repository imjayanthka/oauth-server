'use strict';
const admin = require('../config/admin');
var db = admin.database()
var refString = 'refreshTokens'


module.exports.find = (key, done) => {
    var ref = db.ref(refString + '/'+ key)
    ref.on('value', function(snapshot){
        var returnVal = {
        }
        returnVal[key] = snapshot.val()
        return done(null, returnVal)
    }, function(err){
        return done(new Error('Refresh Token not found'))
    })
}

module.exports.findByUserIdAndClientId = (userId, clientId, done) => {
    var ref = db.ref(refString)
    ref.orderByKey().equalTo(userId).on("value", function (snapshot) {
        // console.log(snapshot.val())
        // console.log('************************')
        if(snapshot.val()){
            //Snapshots exsits
            let token;
            snapshot.forEach(function(item){
                if(item.clientId === clientId){
                   return done(null, item.key)
                } else {
                    return done(new Error('Token Not Found'))
                }
            })
        } else {
            //no snapshots
            return done(new Error('Token Not Found'))
        }
    }, function(error){
        return done(new Error('Token Not Found'))
    });
};


module.exports.save = (token, clientId, userId, done) => {
    var ref = db.ref(refString)
    ref.child(token).set({
        clientId: clientId,
        userId: userId
    })
    done()
}