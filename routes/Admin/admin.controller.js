const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//getting complete manager details
const getManager = async(req,res)=>{
    try{
        const getManagerData = await prisma.manager_details.findMany({
            select:{
                id:true,
                name:true,
                unique_id:true
            }
        })
        console.log({getManagerData})
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:getManagerData
        })
    }catch(err){
        console.log("err----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })

    }
}

//get leave request by manager
const getLeaveRequest = async(req,res)=>{
    try{
        
        const leaveRequest = await prisma.leave_table.findMany({
            where:{
                uniqueRequester_Id:{
                    startsWith:"Mngr"
                }
            }
        })
        console.log({leaveRequest})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:leaveRequest
        })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//search leave using manager name
const searchByName = async(req,res)=>{
    try{
        const {managerName} = req.body
        if(!managerName){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Manager name is required"
            })
        }
        const findLeaveRequest = await prisma.leave_table.findMany({
            where:{
                uniqueRequester_Id:{
                    startsWith:"Mngr"
                },
                
            }
        })
        console.log({findLeaveRequest})
        
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:findLeaveRequest
        })
        if(findLeaveRequest.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"No result found"
            })
        }

    }catch(err){
        console.log("error---",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//getting complete rep details
const getRep = async(req,res)=>{
    try{
        const getRepData = await prisma.rep_details.findMany({
            select:{
                id:true,
                name:true,
                unique_id:true
            }
        })
        console.log({getRepData})
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:getRepData
        })
    }catch(err){
        console.log("err----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })

    }
}

//getting leaveRequest applied by Rep
const repLeaveRequest = async(req,res)=>{
    try{
        
        const leaveRequest = await prisma.leave_table.findMany({
            where:{
                uniqueRequester_Id:{
                    startsWith:"Rep"
                }
            }
        })
        console.log({leaveRequest})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:leaveRequest
        })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//accept/reject leave request
const acceptLeaveRequest = async(req,res)=>{
    try{
        const{leaveRequestId,status,leaveType,uniqueRequesterId} = req.body
          const leaveRequset = await prisma.leave_table.update({
            where:{
                id:leaveRequestId,
                type:leaveType,
                uniqueRequester_Id:uniqueRequesterId
            },
            data:{
                status:status
            }
          })
          console.log({leaveRequset})
          res.status(200).json({
            error:false,
            success:true,
            message:`successfully{$status}the leave request`
          })
    }catch(err){
       res.status(404).json({
        error:true,
        success:false,
        message:"internal server error"
       })
    }
}





module.exports = {getManager,getLeaveRequest,searchByName,getRep,repLeaveRequest,acceptLeaveRequest}