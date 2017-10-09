'use strict';

const passport = require('passport');
const firebase = require('../config/firebase')
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const db = require('../db');



/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
    (username, password, done) => {
      // db.users.findByUsername(username, (error, user) => {
      //   console.log(user)
      //   console.log(user.passwordHash)        
      //   console.log('***********************')
      //   if (error) return done(error);
      //   if (!user) return done(null, false);
      //   bcrypt.compare(password, user.passwordHash, function (err, res) {
      //     if(res == true){
      //       console.log('true')
      //       return done(null, user);
      //     }
      //     else {
      //       console.log('false')
      //       return done(null, false)
      //     }
      //   });
      // });
      firebase.auth().signInWithEmailAndPassword(username, password)
      .then(function (user){
        // console.log(firebase.auth().currentUser)
        // console.log("*************************")
        done(null, firebase.auth().currentUser)
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // console.log(errorCode +" : "+ errorMessage)
        // ...
        done(null, false)
      });
    }
  ));

  
  /**
   * BasicStrategy & ClientPasswordStrategy
   *
   * These strategies are used to authenticate registered OAuth clients. They are
   * employed to protect the `token` endpoint, which consumers use to obtain
   * access tokens. The OAuth 2.0 specification suggests that clients use the
   * HTTP Basic scheme to authenticate. Use of the client password strategy
   * allows clients to send the same credentials in the request body (as opposed
   * to the `Authorization` header). While this approach is not recommended by
   * the specification, in practice it is quite common.
   */
  function verifyClient(clientId, clientSecret, done) {
    console.log(clientId)
    console.log(clientSecret)
    console.log("************************************")
    db.clients.findByClientId(clientId, (error, client) => {
      if (error) return done(error);
      if (!client) return done(null, false);
      if (client.clientSecret !== clientSecret) return done(null, false);
      return done(null, client);
    });
  }
  
  passport.use('client-basic', new BasicStrategy(verifyClient));
  
  passport.use(new ClientPasswordStrategy(verifyClient));
  
  /**
   * BearerStrategy
   *
   * This strategy is used to authenticate either users or clients based on an access token
   * (aka a bearer token). If a user, they must have previously authorized a client
   * application, which is issued an access token to make requests on behalf of
   * the authorizing user.
   */
  passport.use(new BearerStrategy(
    (accessToken, done) => {
      db.accessTokens.find(accessToken, (error, token) => {
        if (error) return done(error);
        if (!token) return done(null, false);
        if (token.userId) {
          db.users.findByUserId(token.userId, (error, user) => {
            if (error) return done(error);
            if (!user) return done(null, false);
            // To keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes.
            done(null, user, { scope: '*' });
          });
        } else {
          // The request came from a client only since userId is null,
          // therefore the client is passed back instead of a user.
          db.clients.findByClientId(token.clientId, (error, client) => {
            if (error) return done(error);
            if (!client) return done(null, false);
            // To keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes.
            done(null, client, { scope: '*' });
          });
        }
      });
    }
  ));



  passport.serializeUser((user, done) => done(null, user.uid));

  passport.deserializeUser((id, done) => {
    console.log(id)
    db.users.findById(id, (error, user) => done(error, user));
  });