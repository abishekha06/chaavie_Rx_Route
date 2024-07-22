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
                pincode:parseInt(pincode),
                created_date:date,
                type:type,
                unique_id:code,
                password:password
            }
        })
        console.log({registration})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:registration
        })

    }catch(err){
        console.log("error-----",err)
        res.status(404).json({
            error:true,
            success:true,
            message:"Internal server error"
        })
    }
}

//get employee(rep)list
const get_Replist = async(req,res)=>{
    try{
        const {manager_id} = req.body
        if(!manager_id){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Manager ID is required"
            })
        }
        const getRep = await prisma.rep_details.findMany({
            where:{
              created_by:manager_id
            }
        })
        console.log({getRep})
        if(getRep.length===0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Provided Invalid ID"
            })
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getRep
        })
  
    }catch(err){
        console.log("error---",err)
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//leave request
const leave_request = async(req,res)=>{
    try{
        const {requester_uniqueId,reason,to_date,from_date,type,requester_id} = req.body
         const date = new Date()
        if(requester_uniqueId && reason && to_date &&from_date &&type &&requester_id){
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
                status:"Pending",
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
        }else{
            return res.status(404).json({
                error:true,
                success:false,
                message:"Some fields are missing"
            })
        }
    }catch(err){
        console.log("error-----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
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
            message:"Internal server error"
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
                // status:"pending",
                manager_uniqueId:managerId

            },
            orderBy:{
                created_date:"desc"
            }
        })


        console.log({get_requestedRep})
        const leaveRequestWithRepdetail = []
        for(let i=0 ; i<get_requestedRep.length ; i++){
            console.log("jjjjj")
            const leaveRequest=get_requestedRep[i]
            console.log({leaveRequest})
            const findRepdata = await prisma.rep_details.findMany({
                where:{
                    unique_id:leaveRequest?.uniqueRequester_Id
                }
            })
            console.log({findRepdata})
            leaveRequestWithRepdetail.push({
                ...leaveRequest,
                repDetails: findRepdata
            });
        }
       
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:leaveRequestWithRepdetail
        })

    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//editing the doctor details (rep/manager)
const edit_doctor = async(req,res)=>{
    // console.log("request----")
    // console.log("reqffffuest----",req)
    try{
        const {created_UserId,dr_id,dr_name,qualification,gender,specialization,mobile,visits,dob,wedding_date,
            products,chemist,addressId,address
        } = req.body
        const date = new Date()
        const edit_data = await prisma.doctor_details.update({
            where:{
                created_UId:created_UserId,
                id:dr_id
            },
            data:{
              doc_name:dr_name,
              doc_qualification:qualification,
              gender:gender,
              specialization:specialization,
              mobile:mobile,
              no_of_visits:visits,
              date_of_birth:dob,
              wedding_date:wedding_date,
              products:products,
              chemist:chemist,
              modified_date:date,
              modified_by:created_UserId
            }
        })
         console.log({edit_data})
         const editAddress = await prisma.doctor_address.update({
            where:{
                id:addressId
            },
            data:{
              address:address
            }
         })
         console.log({editAddress})
         res.status(200).json({
            error:true,
            success:false,
            message:"Successfully edited",
            data:edit_data
         })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//list all managers
const list_manager = async(req,res)=>{
    try{
        const list_manager = await prisma.manager_details.findMany()
        res.status(200).json({
            error:true,
            success:false,
            message:"Successfull",
            data:list_manager
        })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}
 
//list expense report 
const list_expenseRequest = async(req,res)=>{
    try{
        const{reporting_officerId} = req.body
        const list_report = await prisma.expense_report.findMany({
            where:{
                reporting_officer:reporting_officerId,
                // status:"Pending"
            }
        })
         console.log({list_report})
         const userDetails = []
        
         for(let i=0 ; i<list_report.length; i++){
            const ExpenseReport = list_report[i]
            const dr_id = list_report[i].doct_id
          const userId = ExpenseReport.uniqueRequesterId
          console.log({userId})
          const find_userDetails = await prisma.rep_details.findMany({
            where:{
               unique_id:userId 
            },
            select:{
                id:true,
                name:true
            }
          })
          //for finding the doctor details
          const findDoctorDetails = await prisma.doctor_details.findMany({
            where:{
                id:dr_id
            },
            select:{
                id:true,
                doc_name:true
            }
          })
          console.log({find_userDetails})
          userDetails.push({
            ...ExpenseReport,
            userDetails:find_userDetails,
            doctorDetails:findDoctorDetails
          })
         }
         res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:userDetails
         })
    }catch(err){
        console.log("error-----",err)
        res.status(400).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//accept or reject pending request
const change_reportStatus = async(req,res)=>{
    try{
        const {report_id,status,approved_by} = req.body
        const date = new Date
        const updateStatus = await prisma.expense_report.update({
            where:{
                id:report_id,
            },
            data:{
                status:status,
                approved_by:approved_by,
                approved_date:date
            }
        })
        console.log({updateStatus})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:updateStatus
        })
    }catch(err){
     console.log("error----",err)
     res.status(404).json({
        error:true,
        success:false,
        message:"Internal server error"
     })
    }
}
// searching both dr and rep
const search_Rep_Dr = async(req,res)=>{
    try{
        const {searchData} = req.body
        const find_fromDr = await prisma.doctor_details.findMany({
            where:{
                doc_name:{
                    startsWith:`Dr.${searchData}`,
                    mode:'insensitive'
                }
            }
        })
        const find_fromRep = await prisma.rep_details.findMany({
            where:{
                name:{
                    startsWith:searchData,
                    mode:'insensitive'
                }
            }
        })
     const resultarray = []
     resultarray.push({
        doctor_result:find_fromDr,
        rep_result:find_fromRep
     })
     res.status(200).json({
        error:false,
        success:true,
        message:"Successfull",
        data:resultarray
     })
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}

//edit rep
const editRep = async(req,res)=>{
    console.log({req})
    try{
        const{repId,name, gender, dob, nationality, mobile, email, designation, qualification, reporting_officer, address, type, password,headquarters,modified_by }=req.body
        const date = new Date()
        const editedData = await prisma.rep_details.update({
            where:{
                id:repId,
            },
            data:{
                
                name:name,
                gender:gender,
                mobile:mobile,
                date_of_birth:dob,
                Nationality:nationality,
                email:email,
                designation:designation,
                qualification:qualification,
                reporting_officer:reporting_officer,
                address:address,
                type:type,
                password:password,
                headquarters:headquarters,
                modified_by:modified_by,
                modified_date:date
            }
        })
        console.log({editedData})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully edited the data",
            data:editedData
        })

    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}








module.exports = {register_manager,get_Replist,leave_request,accept_leaveRequest,getApplide_leaveReuest,edit_doctor,list_manager,list_expenseRequest,change_reportStatus,search_Rep_Dr,editRep}