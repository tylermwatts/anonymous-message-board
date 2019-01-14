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
const ReplyHandler = require('../controllers/replyHandler.js');

module.exports = function (app) {
  const postHandler = new PostHandler();
  const replyHandler = new ReplyHandler();
  
  app.route('/api/threads/:board')
      .get(postHandler.getPosts)
      .post(postHandler.newPost)
      .delete(postHandler.deletePost)
      .put(postHandler.reportPost);
    
  app.route('/api/replies/:board')
      .get()
      .post(replyHandler.postReply)
      .delete()
      .put();

};
