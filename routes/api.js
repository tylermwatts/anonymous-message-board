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

const postSchema = mongoose.Schema({
  text: {type: String, required: true},
  created_on: {type: Date, required: true, default: new Date()},
  bumped_on: {type: Date, required: true, default: new Date()},
  reported: {type: Boolean, 
})

module.exports = function (app) {
  mongoose.connect(process.env.DB_URI, {useNewUrlParser: true});
  
  app.route('/api/threads/:board')
      .get()
  
      .post(function(req, res){
        
      })
  
      .put()
  
      .delete();
    
  app.route('/api/replies/:board')
      .get()
      .post()
      .put()
      .delete();

};
