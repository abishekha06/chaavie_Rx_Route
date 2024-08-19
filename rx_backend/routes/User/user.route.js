const express = require('express')
const userRouter =express.Router()
const {userRegistration,listArea,listDoctors,getAddedDoctor,todaysTravelPlan,addSchedule,editSchedule,approveDoctors,
    getDoctorList_forApproval
} = require('./user.controller')




userRouter.post('/userRegistration',userRegistration)
userRouter.post('/listArea',listArea)
userRouter.post('/listDoctors',listDoctors)
userRouter.post('/getAddedDoctor',getAddedDoctor)
userRouter.post('/todaysTravelPlan',todaysTravelPlan)
userRouter.post('/addSchedule',addSchedule)
userRouter.post('/editSchedule',editSchedule)
userRouter.post('/approveDoctors',approveDoctors)
userRouter.post('/doctorForApproval',getDoctorList_forApproval)









module.exports = userRouter
