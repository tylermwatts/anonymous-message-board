/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect   = require('chai').expect;
const bcrypt   = require('bcrypt');
const mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connect(process.env.DB_URI, {useNewUrlParser: true});
  
  app.route('/api/threads/:board')
      .get()
      .post()
      .put()
      .delete();
    
  app.route('/api/replies/:board');

};
