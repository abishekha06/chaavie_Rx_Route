const express = require('express')
const repRouter =express.Router()

const {rep_registration,login,add_doctor,get_addedDoctors} = require('./rep.controller')


repRouter.post('/repRegistration',rep_registration)
repRouter.post('/login',login)
repRouter.post('/add_dr',add_doctor)
repRouter.post('/getDr',get_addedDoctors)











module.exports = repRouter