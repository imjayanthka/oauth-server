'use strict';

const clients = [
    { id: '1', name: 'Google API', clientId: '698556221027-dn7qgjtsgr84ih6k0a4t6a4ntlck7vm4.apps.googleusercontent.com', clientSecret: 't95CBT3uXx7095L3PTJydWLD', isTrusted: false }
];

module.exports.findById = (id, done) => {
    for (let i = 0, len = clients.length; i < len; i++) {
        if (clients[i].id === id) return done(null, clients[i]);
    }
    return done(new Error('Client Not Found'));
};

module.exports.findByClientId = (clientId, done) => {
    // console.log(clientId)
    // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    for (let i = 0, len = clients.length; i < len; i++) {
        if (clients[i].clientId === clientId) return done(null, clients[i]);
    }
    return done(new Error('Client Not Found'));
};