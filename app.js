const express = require('express');
let app = express();
let server = require('http').createServer(app);
const controller = require('./controller');
const Chat = require('./service')
const chatService = new Chat()
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true  }) )

let io = require("socket.io")(server, {
     cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.username, event: 'left'});  
  });
  socket.on('set-name', (name) => {
    socket.username = name;
    io.emit('users-changed', {user: name, event: 'joined'});    
  });
  
  socket.on('send-message', (message) => {
    io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
  });
});



app.post('/chat_id', async (req,res)=>{
  let id = req.body.id
  console.log(id)
  let datos = await chatService.chatsId(id)
  res.send(datos) 
})
app.post('/chats_user', async (req,res)=>{
  let id = req.body.id
  let datos = await chatService.chatsByUser(id)
  console.log(datos)
  res.send(datos) 
})
app.post('/enviar_mensaje', async (req,res)=>{
  await chatService.enviarMensaje(req.body)
  res.send('enviado..')
})
app.post('/crear_match', async (req,res)=>{
  console.log(req.body)
  await chatService.crearMatch(req.body)
  res.send('match creado..')
})
app.post('/crear_usuario', async (req,res)=>{
  console.log(req.body)
  await chatService.crearUsuario(req.body)
  res.send('usuario creado..')
})

app.post('/mi_perfil', async (req,res)=>{
  let id = req.body.idUser
  console.log(req.body)
  console.log('id: ', id)
  let user = await chatService.miPerfil(id)
  console.log(user)
  res.send(user)
})




app.post('/buscar_perfiles', async (req,res)=>{
  let id = req.body.idUser
  let busca = req.body.busca
  let sexo = req.body.sexo
  let salida = await chatService.buscarMatch(busca, sexo, id)
  console.log('bueno chao')
  res.send(salida)
})

////{"idUser": "B57K2a3yQURiPlo8Vo0EiRIfurq1", "idPareja": "B57K2a3yQURiPlo8Vo0EiRIfurq11a"}
//{"idUser":"B57K2a3yQURiPlo8Vo0EiRIfurq1", "busca":"M", "sexo": "F"}
//{"idUser":"B57K2a3yQURiPlo8Vo0EiRIfurq1", "busca":"M", "sexo": "F"}

app.post('/agregar_espera', async (req, res) => {
  let idUser = req.body.idUser
  let idPareja = req.body.idPareja
  await chatService.addEspera(idUser, idPareja)
  res.send('Agregado..')

})


app.post('/verificar_match', async (req, res) => {
  let idUser = req.body.idUser
  let idPareja = req.body.idPareja
  let salida = await chatService.verificarMatch(idUser, idPareja)
  if(salida.length == 0){
    res.send( {'match': false} )
  }
  else{
    res.send( {'match': true} )
  }

})

app.post('/desactivar_perfil', async (req, res) => {
  let idUser = req.body.idUser
  await chatService.desactivarPerfil(idUser)
  await chatService.desactivarMatch(idUser)
  res.send('desactivado..')

})





var port = process.env.PORT || 3000;
app.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});



/*let app = require('express')();
let server = require('http').createServer(app);

let io = require("socket.io")(server, {
     cors: {
    origin: '*',
  }
});


io.on('connection', (socket) => {

  socket.on('join_room', room => {
    console.log('unirse a: ', room)
    socket.join(room)
  })
 
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.username, event: 'left'});  
  });

  socket.on('typing', ({room}) => {
    socket.to(room).emit('typing', 'Someone is typing')
  })

  
  socket.on('set-name', (name) => {
    socket.username = name;
    io.emit('users-changed', {user: name, event: 'joined'});    
  });
  
  socket.on('send-message', (message) => {
    io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
  });
});
var port = process.env.PORT || 3000;
server.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});*/