const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = process.env.DB_URI;
const assert = require('assert');

function ReplyHandler(){
  const postReply = function(req, res){
    let board = req.params.board;
    let thread_id = req.body.thread_id;
    let reply = {
      text: req.body.text,
      delete_password: req.body.delete_password,
      created_on: new Date(),
      reported: false,
    }
    mongo.connect(url, {useNewUrlParser: true}, (err, client)=>{
      const db = client.db('fcc-training');
      db.collection(board).findOne({_id: new ObjectID(thread_id)}, (err,post)=>{
        assert.equal(null,err);
        post.replies.push(reply);
      })
      client.close();
    })
    res.redirect('/b/'+board+'/'+thread_id+'/');
  }
}

module.exports = ReplyHandler;