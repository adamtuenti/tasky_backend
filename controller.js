const express = require('express');
const router = express.Router();
const ChatbotService = require('./service')


router.get('users', async (req,res)=>{
  console.log('aqui')
    let datos = await chatbotService.ContactsChat()
    res.send(datos) 
})

module.exports = router;