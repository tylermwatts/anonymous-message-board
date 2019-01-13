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
  board: {type: String, required: true},
  text: {type: String, required: true},
  created_on: {type: Date, required: true, default: new Date()},
  bumped_on: {type: Date, required: true, default: new Date()},
  reported: {type: Boolean, required: true, default: false},
  delete_password: {type: String, required: true},
  replies: {type: [], default: []},
})

const Post = mongoose.model('Post', postSchema);

module.exports = function (app) {
  mongoose.connect(process.env.DB_URI, {useNewUrlParser: true});
  
  app.route('/api/threads/:board')
      .get(function(req,res){
        Post.find({board: req.params.board}).select('-_id -reported -delete_password -__v').exec((err,posts)=>{
          if (err) res.send(err);
          res.send(posts);
        })
      
      })
  
      .post(function(req, res){
        var hashedPw = bcrypt.hashSync(req.body.delete_password, 12);
        let newPost = new Post({
          board: req.params.board,
          text: req.body.text,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false,
          delete_password: hashedPw,
          replies: []
        })
        newPost.save(err=>{
          if (err) res.json({error: err})
        })
        res.redirect('/b/'+req.params.board)
      })
  
      .put()
  
      .delete();
    
  app.route('/api/replies/:board')
      .get()
      .post()
      .put()
      .delete();

};
