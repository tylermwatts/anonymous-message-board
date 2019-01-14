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
    mongo.connect(url, (err,client)=>{
      assert.equal(null, err);
      const db = client.db('fcc-training');
      db.collection(board).insertOne(post)
      client.close();
    })
    res.redirect('/b/'+board+'/');
  }
  
  this.postList = function(req,res){
    let board = req.params.board;
    mongo.connect(url, (err,client)=>{
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
          posts.forEach(post=>{
            post.replycount = post.replies.length;
            if (post.replycount > 3){
              post.replies = post.replies.slice(-3)
            }
          })
          res.json(posts)
        })
      client.close();
    })
  }
  
  this.deletePost = function(req,res){
    let board = req.params.board;
    mongo.connect(url, (err,client)=>{
      assert.equal(null,err);
      const db = client.db('fcc-training');
      db.collection(board)
        .deleteOne({_id: new ObjectID(req.body.id)}, (err,data)=>{
          if (err) return res.json({error: err})
        
        })
      client.close();
    })
  }
  
}

module.exports = PostHandler;
