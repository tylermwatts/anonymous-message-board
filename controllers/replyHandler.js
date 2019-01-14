const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = process.env.DB_URI;
const assert = require('assert');

function ReplyHandler(){
  this.postReply = function(req, res){
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
      db.collection(board).findOne({_id: new ObjectID(thread_id)}, {delete_password: 0, reported: 0}, (err,post)=>{
        assert.equal(null, err);
        // make a new array of replies sorted from newest to oldest
        let sortedReplies = post.replies.sort((a,b)=>{
          b.created_on - a.created_on
        }).concat([])
        sortedReplies.map(r=>{
          delete r.delete_password
          delete r.reported
        })
        console.log(sortedReplies);
        res.json(sortedReplies);
      })
      client.close();
    })
  }
  
}

module.exports = ReplyHandler;