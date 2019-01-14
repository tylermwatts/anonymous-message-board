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
  const postHandler = new PostHandler();
  
  app.route('/api/threads/:board')
      .get(postHandler.postList)
      .post(postHandler.newPost)
      .delete(postHandler.deletePost)
      .put();
    
  app.route('/api/replies/:board')
      .get()
      .post()
      .delete()
      .put();

};
