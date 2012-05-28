var fs = require('fs');
var apiKey = 'api-key-goes-here';
try {
  apiKey = fs.readFileSync('api_key', 'ascii').replace(/^\s+|\s+$/g, '');
  console.log('Read api_key from disc:', apiKey);
}
catch (err) {
  console.log('Failed to read api_key. Requests will probably fail.');
}

var chain = new (require('chainer'));
var hipchat = require('./index');
var hip = new hipchat(apiKey);
var rooms = hip.Rooms;
var users = hip.Users;

// Get a list of rooms.
chain.add(function(){
  rooms.list(function(err, res){
    if (err) throw new Error(err.message);
    console.log('Rooms: ', res);
    chain.next(res.rooms[0].room_id);
  });
});

// Get detailed room info.
chain.add(function(id){
  rooms.show(id, function(err, res){
    if (err) throw new Error(err.message);
    console.log('Room #'+id+': ', res);
    chain.next(id);
  });
});

// View history of a room.
chain.add(function(id){
  rooms.history(id, function(err, res){
    if (err) throw new Error(err.message);
    console.log('Recent messages: ', res);
    chain.next(id);
  });
});

// Get a list of users.
chain.add(function(){
  users.list(function(err, res){
    if (err) throw new Error(err.message);
    console.log('Users: ', res);
    chain.next(res.users[0].user_id);
  });
});

// Get detailed user info.
chain.add(function(id){
  users.show(id, function(err, res){
    if (err) throw new Error(err.message);
    console.log('User #'+id+': ', res);
    chain.next(id);
  });
});

chain.run();
