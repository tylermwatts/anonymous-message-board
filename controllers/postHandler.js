const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const url = process.env.DB_URI;

function PostHandler(){
  this.postList = function(req,res){
    let board = req.params.board;
    mongodb.connect(url, (err,db)=>{
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
            
          })
        })
    })
  }

}

module.exports = PostHandler;