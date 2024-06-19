const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//getting complete manager details
const getUserDetails = async(req,res)=>{
    try{
       
        const getManagerData = await prisma.manager_details.findMany({
            select:{
                id:true,
                name:true,
                unique_id:true
            }
        })
        console.log({getManagerData})
        const getRepData = await prisma.rep_details.findMany({
            select:{
                id:true,
                name:true,
                unique_id:true
            }
        })
        console.log({getRepData})
        const data = [...getManagerData ,...getRepData]

        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:data
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
                
                status:"Pending"
            }
        })
        console.log({leaveRequest})
        const userData = []
        for(let i=0; i<leaveRequest.length;i++){
            const leave_request = leaveRequest[i]
            
            const requesterId = leaveRequest[i]?.uniqueRequester_Id
            console.log({requesterId})
            let data = []

            if(requesterId.startsWith('Mngr')){
            data = await prisma.manager_details.findMany({
                where:{
                    unique_id:requesterId
                },
                select:{
                    name:true
                }
            })
            console.log({data})

        }else{
            data = await prisma.rep_details.findMany({
                where:{
                    unique_id:requesterId
                },
                select:{
                    name:true
                }
            }) 
            console.log({data})
        }
        
        userData.push({
                leaveRequest: leave_request,
                userdetails: data[0]
              });
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:userData,
            
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

//getting leaveRequest applied by Rep
const repLeaveRequest = async(req,res)=>{
    try{
        
        const leaveRequest = await prisma.leave_table.findMany({
            where:{
                uniqueRequester_Id:{
                    startsWith:"Rep"
                },
                
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





module.exports = {getUserDetails,getLeaveRequest,repLeaveRequest,acceptLeaveRequest}