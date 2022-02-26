let app = require('express')();
let server = require('http').createServer(app);

const express = require('express');
const router = express.Router();
const ChatbotService = require('./service')


let io = require("socket.io")(server, {
     cors: {
    origin: '*',
  }
});




/*mongoose.connect('mongodb+srv://adan_navarrete:096367789ClaveTasky@chat-tasky.4fj3c.mongodb.net/tasky_chat?retryWrites=true&w=majority')
.then(db => console.log('conectado db'))
.catch(err => console.log(err))*/

/*
dbClient = mongoClient.connect(url, { useNewUrlParser: true })
  .then(client => {
    console.log('MongoDB client has been successfully created');

    return client.db('chat-tasky');
  })
  .catch(err => {
    console.log(`Error occurred while connecting to mongodb: ${err}`);
  });*/


 
io.on('connection', (socket) => {
 
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.username, event: 'left'});   
  });
 
  socket.on('set-name', (name) => {
    socket.username = name;
    io.emit('users-changed', {user: name, event: 'joined'});    
  });

  socket.on('join_room', room => {
    socket.join(room)
  })
  
  socket.on('send-message', ({room, message}) => {

    socket.to(room).emit('message', {
      msg: message.text, 
      user: socket.username, 
      createdAt: new Date()
    })
  })

  socket.on('typing', ({room}) => {
    socket.to(room).emit('typing', 'Someone is typing')
  })

  socket.on('stopped_typing', ({room}) => {
    socket.to(room).emit('stopped_typing')
  })

    
    //io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});
    //let json = {msg: message.text, user: socket.username, createdAt: new Date()}
   /* dbClient
          .then(db => db
            .collection('mensajes')
            .insertOne(json));  });
    });*/

  })


 
var port = process.env.PORT || 3000;
 
server.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});


router.get('/chat/users', async (req,res)=>{
  console.log('aqui')
    let datos = await chatbotService.ContactsChat()
    res.send(datos) 
})