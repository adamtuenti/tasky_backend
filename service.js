const mongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
let dbClient = null;
let url = 'mongodb+srv://adan_navarrete:096367789ClaveTasky@chat-tasky.4fj3c.mongodb.net/tasky_chat?retryWrites=true&w=majority'

class Chat{

    constructor() {
    }
    
    dbClient = mongoClient.connect(url, { useNewUrlParser: true })
        .then(client => {
            console.log('MongoDB client has been successfully created');

            return client.db('chat-tasky');
        })
        .catch(err => {
            console.log(`Error occurred while connecting to mongodb: ${err}`);
        });


    chatsByUser(actualUserId){
    
        var query = {$or: [ {'user1': {$eq: actualUserId}  }, {'user2': {$eq: actualUserId}  } ]  }
        var query1 = {$and: [query ,  {'Visibilidad': true}, {'ultimoMensaje': -1} ] }
        return this.dbClient.then(db=>db
            .collection('match')
            .find(query1)
            .limit(25)
            .sort({_id: -1})
            .toArray()
        )
    }

    chatsId(id){
        var query = {'idChat': {$eq: id}  }
        return this.dbClient.then(db=>db
            .collection('mensajes')
            .find(query)
            .limit(50)
            .sort({_id: 1})
            .toArray()
        )

    }

    enviarMensaje(json){
        this.dbClient
          .then(db => db
            .collection('mensajes')
            .insertOne(json)
        );
        return 'Enviado'
    }

    crearMatch(json){
        this.dbClient
          .then(db => db
            .collection('match')
            .insertOne(json)
        );
        return 'Enviado'
    }

    crearUsuario(json){
        this.dbClient
          .then(db => db
            .collection('users')
            .insertOne(json)
        );
        return 'Enviado'
    }

    miPerfil(id){
        var query = {'idUser': {$eq: id}  }
        return this.dbClient.then(db=>db
            .collection('users')
            .find(query)
            .limit(50)
            .toArray()
        )
    }

    buscarMatch(busca, sexo, id){
        var query = {$and: [ {'sexo': {$eq: busca}  }, {'busca': {$eq: sexo}  }, {'idUser': { $ne: id }  }, {'activo': {$eq: true}},  {'esperando_match': {$nin: [id]}}  ]  }
        return this.dbClient.then(db=>db
            .collection('users')
            .find(query)
            .limit(35)
            .toArray()
        )
    }

    /*verificarNoMatchUser(actual, cita){
        var query = {$and: [ {'user1': {$eq: actual}  }, {'user2': {$eq: cita}}, {'enEspera': {$eq: false}   } ]  }
        var query1 = {$and: [ {'user2': {$eq: actual}  }, {'user1': {$eq: cita}}, {'enEspera': {$eq: false}   } ]  }
        var query2 = {$or: [query ,  query1 ] }
        return this.dbClient.then(db=>db
            .collection('match')
            .find(query2)
            .limit(5)
            .sort({_id: -1})
            .toArray()
        )
    }*/

    //verifico si su id esta en mi lista de espera
    //para ver si cuando yo le doy like ella ya me ha dado like.
    verificarMatch(id, idPareja){
        var query = {$and: [ {'esperando_match': {$in: [idPareja]}}, {'idUser': { $eq: id }  }, {'activo': {$eq: true}}  ]  }
        return this.dbClient.then(db=>db
            .collection('users')
            .find(query)
            .limit(35)
            .toArray()
        )

    }

    //cuando le doy like mi id esta en la lista de espera de ella.

    addEspera(id, idPareja){
        return this.dbClient.then(db=>db
            .collection('users').updateOne(
            {'idUser': idPareja},
            {$push: {'esperando_match': id}}
            )
        )

    }

    desactivarPerfil(idUser){
        return this.dbClient.then(db=>db
            .collection('users').updateOne(
                {'idUser': idUser},
                {
                    $set: { "activo": false },
                }
            )
        )
    }

    desactivarMatch(idUser){
        var query = {$or: [ {'user1': {$eq: idUser}  }, {'user2': {$eq: idUser}  } ]  }
        return this.dbClient.then(db=>db
            .collection('match').updateOne(
                query,
                {
                    $set: { "Visibilidad": false },
                }
            )
        )

    }

  /*  async recorrerMatch(busca, sexo, id){
        let salida = []
        let users = await buscarMatch(busca, sexo, id)
        for(let i = 0; i < users.length; i ++){
            let u = users[i]
            idCita = u.idUser;
            let resultado = await funcionNoMatch(id, idCita)
            console.log(resultado)
        }
        


        return salida

    }*/



    /*funcionNoMatch(id, idCita){
        let conicidencias = await verificarNoMatchUser(id, idCita)
        if(conicidencias.length == 0){
            return true
        }else{
            return false
        }

    }*/
  






}

module.exports = Chat;