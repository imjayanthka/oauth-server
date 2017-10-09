'use strict';
const admin = require('./admin');
const users = require('./users');
const clients = require('./clients');
const accessTokens = require('./access_tokens');
const authorizationCodes = require('./authorization_codes');
const refreshTokens = require('./refresh_tokens')

module.exports = {
  admin,
  users,
  clients,
  accessTokens,
  authorizationCodes,
  refreshTokens,
};