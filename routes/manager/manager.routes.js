const express = require('express')
const managerRouter =express.Router()

const{register_manager,get_Replist,leave_request,accept_leaveRequest,getApplide_leaveReuest}=require('./manager.controller')



managerRouter.post('/managerRegister',register_manager)
managerRouter.post('/get_Replist',get_Replist)
managerRouter.post('/leaveRequest',leave_request) //for both rep and manager
managerRouter.post('/acceptLeave',accept_leaveRequest)
managerRouter.post('/getLeaveRequest',getApplide_leaveReuest)






















module.exports=managerRouter