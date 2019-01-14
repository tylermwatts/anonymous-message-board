const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = process.env.DB_URI;
const assert = require('assert');

function PostHandler(){
  
  this.newPost = function(req,res){
    let board = req.params.board;
    let post = {
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    }
    mongo.connect(url, {useNewUrlParser: true}, (err,client)=>{
      assert.equal(null, err);
      const db = client.db('fcc-training');
      db.collection(board).insertOne(post)
      client.close();
    })
    res.redirect('/b/'+board+'/');
  }
  
  this.getPosts = function(req,res){
    let board = req.params.board;
    mongo.connect(url, {useNewUrlParser: true}, (err,client)=>{
      assert.equal(null,err);
      const db = client.db('fcc-training');
      db.collection(board)
        .find({},{
          reported: 0,
          delete_password: 0
        })
        .sort({bumped_on: -1})
        .limit(10)
        .toArray((err,posts)=>{
          if (err) res.json({error: err})
          posts.map(post=>{
            post.replycount = post.replies.length;
            post.replies = post.replycount > 3 ? post.replies.slice(-3) : post.replies
          })
          res.json(posts)
        })
      client.close();
    })
  }
  
  this.deletePost = function(req,res){
    let board = req.params.board;
    mongo.connect(url, {useNewUrlParser: true}, (err,client)=>{
      assert.equal(null,err);
      const db = client.db('fcc-training');
      db.collection(board)
        .findOne({
          _id: new ObjectID(req.body.thread_id),
          delete_password: req.body.delete_password
        }, (err,data)=>{
            if (err) res.json({error: err})
            if (!data) {
              res.send('incorrect password')
            } else {
              res.send('success')
            }
          })
      client.close();
    })
  }
  
  this.reportPost = function(req,res){
    let board = req.params.board;
    mongo.connect(url, {useNewUrlParser: true}, (err,client)=>{
      assert.equal(null,err);
      const db = client.db('fcc-training');
      db.collection(board).findOne({_id: new ObjectID(req.body.thread_id)}, (err, post)=>{
        assert.equal(null,err);
        if (!post){
          return res.send('invalid thread_id');
        } else {
          post.reported = true;
          res.send('success');
        }
      })
      client.close();
    })
  }
  
}

module.exports = PostHandler;
