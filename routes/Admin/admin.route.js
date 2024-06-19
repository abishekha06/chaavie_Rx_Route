const express = require('express')
const adminRouter =express.Router()

const { getManager,getLeaveRequest,searchByName,getRep,repLeaveRequest,acceptLeaveRequest} = require('./admin.controller')


adminRouter.get('/getManagers',getManager)
adminRouter.get('/getLeaveRequest',getLeaveRequest)
adminRouter.post('/searchByName',searchByName)
adminRouter.get('/getRep',getRep)
adminRouter.get('/repLeaveRequest',repLeaveRequest)
adminRouter.post('/LeaveRequest',acceptLeaveRequest) //accept or reject leave request








module.exports = adminRouter