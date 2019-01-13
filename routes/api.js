/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect   = require('chai').expect;
const PostHandler = require('../controllers/postHandler.js');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
      .get(function(req,res){
        
      })
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
