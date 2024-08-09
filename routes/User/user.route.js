const express = require('express')
const userRouter =express.Router()
const {userRegistration,listArea,listDoctors,getAddedDoctor} = require('./user.controller')




userRouter.post('/userRegistration',userRegistration)
userRouter.post('/listArea',listArea)
userRouter.post('/listDoctors',listDoctors)
userRouter.post('/getAddedDoctor',getAddedDoctor)












module.exports = userRouter
