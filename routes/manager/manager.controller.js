const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//manager registration
const register_manager = async(req,res)=>{
    try{
        const{name,dob,gender,qualification,designation,nationality,email,mobile,address,city,pincode,type,password} = req.body
        const date = new Date()
        // const alphabets = "abcdefghijklmnopqrstuvwxyz"
        const numbers = '0123456789'
        let code = ''
        const prefix = "Mngr"
      
        const codeArray = [];
        
        // for (let i = 0; i < 4; i++) {
        //     codeArray.push(alphabets.charAt(Math.floor(Math.random() * alphabets.length)));
        // }
        
        for (let i = 0; i < 4; i++) {
            codeArray.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
        }

      
        // for (let i = codeArray.length - 1; i > 0; i--) {
        //     const j = Math.floor(Math.random() * (i + 1));
        //     [codeArray[i], codeArray[j]] = [codeArray[j], codeArray[i]];
        // }
        const randomNumbers = codeArray.join('');
       
       code = `${prefix}${randomNumbers}`;
        console.log({code})
        const registration = await prisma.manager_details.create({
            data:{
                name:name,
                dob:dob,
                gender:gender,
                qualification:qualification,
                designation:designation,
                nationality:nationality,
                email:email,
                mobile:mobile,
                address:address,
                city:city,
                pincode:pincode,
                created_date:date,
                type:type,
                unique_manager_code:code,
                password:password
            }
        })
        console.log({registration})
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:registration
        })

    }catch(err){
        console.log("error-----",err)
        res.status(404).json({
            error:true,
            success:true,
            message:"internal server error"
        })
    }
}

//get employee(rep)list
const get_Replist = async(req,res)=>{
    try{
        const {manager_id} = req.body
        const getRep = await prisma.rep_details.findMany({
            where:{
              created_by:manager_id
            }
        })
        console.log({getRep})
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:getRep
        })
  
    }catch(err){
        console.log("error---",err)
        res.status(400).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//leave request
const leave_request = async(req,res)=>{
    try{
        const {requester_uniqueId,reason,to_date,from_date,type,requester_id} = req.body
         const date = new Date()
        
        //   const applyLeave = await prisma.leave_table.create({
        //     data:{
        //         requester_id:requester_id,
        //         remark:reason,
        //         to_date:to_date,
        //         from_date:from_date,
        //         status:"pending",
        //         created_date:date,
        //         type:type,
        //         uniqueRequester_Id:requester_uniqueId

        //     }
        //  })
        //  console.log({applyLeave})
        
         const find_repData = await prisma.rep_details.findMany({
            where:{
                unique_id:{
                    startsWith:"Rep"
                }
            }
         })
          console.log({find_repData})
          const managerId = find_repData[0]?.reporting_officer
          console.log({managerId})
          //add mangerId in the table leave_table
         
          const applyLeave = await prisma.leave_table.create({
            data:{
                requester_id:requester_id,
                remark:reason,
                to_date:to_date,
                from_date:from_date,
                status:"pending",
                created_date:date,
                type:type,
                uniqueRequester_Id:requester_uniqueId,
                manager_uniqueId:managerId
            }
         })
         console.log({applyLeave})
            res.status(200).json({
            error:false,
            success:true,
            message:"Successfully applied the Leave",
            data:applyLeave
         })
    }catch(err){
        console.log("error-----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//accepting the leave request of rep
const accept_leaveRequest = async(req,res)=>{
    const{leave_tableId,rep_id,modified_by,status,leave_type} = req.body
    const date =new Date()
    try{
        const leaveAccepting = await prisma.leave_table.update({
            where:{
                id:leave_tableId,
                requester_id:rep_id,
             },
             data:{
                approved_by:modified_by,
                approved_date:date,
                status:status,
                type:leave_type
             }
        })
      
        res.status(200).json({
            error:false,
            success:true,
            message:`Successfully ${status.toLowerCase()} the request`,
            data:leaveAccepting
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

//for getting the applied leaveRequest by rep
const getApplide_leaveReuest = async(req,res)=>{
    console.log({req})
    try{
        const {managerId} = req.body
                // Ensure managerId is defined and valid
                if (!managerId) {
                    return res.status(400).json({
                        error: true,
                        success: false,
                        message: "Manager ID is required"
                    });
                }
        const get_requestedRep = await prisma.leave_table.findMany({
            where:{
                uniqueRequester_Id:{
                    startsWith:"Rep"
                },
                status:"pending",
                manager_uniqueId:managerId

            }
        })


        console.log({get_requestedRep})
       
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:get_requestedRep
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





module.exports = {register_manager,get_Replist,leave_request,accept_leaveRequest,getApplide_leaveReuest}