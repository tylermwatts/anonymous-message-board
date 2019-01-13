const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const url = process.env.DB_URI;

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
    mongodb.connect(url, (err,db)=>{
      if (err) return res.json({error: err})
      db.collection(board).insert(post, ()=>{res.redirect('/b/'+board+'/')})
    })
  }
  
  this.postList = function(req,res){
    let board = req.params.board;
    mongodb.connect(url, (err,db)=>{
      if (err) return res.json({error: err})
      db.collection(board)
        .find({},{
          reported: 0,
          delete_password: 0
        })
        .sort({bumped_on: -1})
        .limit(10)
        .toArray((err,posts)=>{
          if (err) res.json({error: err})
          posts.map(p=>{
            p.replies > 3 ? p.replies.slice(-3) : p.replies
          })
          res.json(posts)
        })
    })
  }
}

module.exports = PostHandler;
