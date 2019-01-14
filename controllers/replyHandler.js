const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = process.env.DB_URI;
const assert = require('assert');

function ReplyHandler(){
  this.postReply = function(req, res){
    let board = req.params.board;
    let thread_id = req.body.thread_id;
    let reply = {
      _id: new ObjectID(),
      text: req.body.text,
      delete_password: req.body.delete_password,
      created_on: new Date(),
      reported: false,
    }
    mongo.connect(url, {useNewUrlParser: true}, (err, client)=>{
      const db = client.db('fcc-training');
      db.collection(board).findOneAndUpdate(
        {_id: new ObjectID(thread_id)},
        {$push: {replies: reply}, $set: {bumped_on: new Date()}},
        {upsert: true})
      client.close();
    })
    res.redirect('/b/'+board+'/'+thread_id+'/');
  }
  
  this.getReplies = function(req,res){
    let board = req.params.board;
    let thread_id = req.query.thread_id;
    mongo.connect(url, {useNewUrlParser: true}, (err,client)=>{
      const db = client.db('fcc-training');
      db.collection(board)
        .find({_id: new ObjectID(thread_id)}, {reported: 0, delete_password: 0, "replies.reported": 0, "replies.delete_password": 0})
        .toArray((err,post)=>{
          assert.equal(null,err);
          res.json(post[0])
        })
      client.close();
    })
  }
  
  this.reportReply = function(req,res){
    let board = req.params.board;
    let thread_id = req.params.thread_id;
    let reply_id = req.params.reply_id;
    mongo.connect(url, {useNewUrlParser: true}, (err,client)=>{
      assert.equal(null,err);
      const db = client.db('fcc-training');
      db.collection(board)
        .findOneAndUpdate({id_: new ObjectID(thread_id), "replies.$._id": new ObjectID(reply_id)},
                          {$set: {"replies.$.reported": true}})
      client.close();
    })
    res.send('success');
  }
  
}

module.exports = ReplyHandler;