const express = require('express')
const adminRouter =express.Router()

const { getUserDetails,getLeaveRequest,repLeaveRequest,acceptLeaveRequest,getExpenseRequest,acceptExpenseRequest} = require('./admin.controller')


adminRouter.get('/userDetails',getUserDetails)
adminRouter.get('/getLeaveRequest',getLeaveRequest)
// adminRouter.post('/searchByName',searchByName)
// adminRouter.get('/getRep',getRep)
adminRouter.get('/repLeaveRequest',repLeaveRequest)
adminRouter.post('/LeaveRequest',acceptLeaveRequest) //accept or reject leave request
adminRouter.get('/getExpenseRequest',getExpenseRequest)
adminRouter.post('/acceptExpenseRequest',acceptExpenseRequest) //accept or reject expense request







module.exports = adminRouter