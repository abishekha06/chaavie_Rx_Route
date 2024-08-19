const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();




//for user registration
const userRegistration = async(req,res)=>{
    try{
        const{
            name,
            gender,
            dob,
            address,
            mobile,
            email,
            designation,
            nationality,
            qualification,
            headquaters,
            password,
            reportingOfficer,
            createdBy,
            adminid,
            reportingType,
            role
        } = req.body

        console.log("req----",req.body)
        const firstLetters = name.slice(0,3).toUpperCase() 
        const lastNumbers = mobile.slice(-3)
        let uniqueId = `${firstLetters}${lastNumbers}`;
        console.log({uniqueId})

        const registration = await prisma.userData.create({
            data:{
                name:name,
                gender:gender,
                date_of_birth:dob,
                address:address,
                mobile:mobile,
                email:email,
                designation:designation,
                nationality:nationality,
                qualification:qualification,
                headquaters:headquaters,
                password:password,
                role:role,
                reportingOfficer_id:reportingOfficer,
                reporting_type:reportingType,
                createdBy:createdBy,
                adminId:adminid,
                uniqueId:uniqueId,
                status:"Active"
            }
        })
        console.log({registration})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully added the user",
            data:registration
        })
    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}


//api for listing the area
const listArea = async(req,res)=>{
    try{
        const {userId} = req.body
        const getHeadquaters = await prisma.userData.findMany({
            where:{
                id:userId
            },
            select:{
                headquaters:true
            }
        })
        console.log({getHeadquaters})
        const area = []
        for(let i=0; i<getHeadquaters.length; i++){
           for(let j=0; j<getHeadquaters[i].headquaters.length; j++){
            const headquarterId = getHeadquaters[i].headquaters[j]
            const findArea = await prisma.headquarters.findMany({
                where:{
                    id:headquarterId
                }
            })
            area.push(findArea)
           }
        }
      
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:getHeadquaters,
            Area:area
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

//api for listing doctor in respective headquaters
const listDoctors = async(req,res)=>{
    console.log({req})
    try{
        const {area,day,userId} = req.body
        const findAreaId = await prisma.headquarters.findMany({
            where:{
                sub_headquarter:area
            }
        })
        console.log({findAreaId})
        const areaId = findAreaId[0].id
        console.log({areaId})

        const findDr = await prisma.doctor_details.findMany({
            where:{
                headquaters:{
                    equals:areaId
                },
            
               created_UId:userId
                
            }
        })
        console.log({findDr})
        const ScheduleList = []
        for(let i=0; i<findDr.length ;i++){
            const drId = findDr[i].id
            console.log({drId})
            const firstName = findDr[i].firstName
            const lastName = findDr[i].lastName
            const visitType = findDr[i].visit_type

            //fing the schedule of the doctor
            const findSchedule = await prisma.schedule.findMany({
                where:{
                 schedule:{
                    path:['day'],
                    equals:day
                 },
                 dr_id:drId
                
                }
            })
            console.log({findSchedule})

               if (findSchedule.length > 0) {
        ScheduleList.push({
            doctor: {
                id: drId,
                firstName: firstName,
                lastName: lastName,
                visitType: visitType,
                schedule: findSchedule
            }
        });
    }
        }


        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:ScheduleList
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

//for getting the added doctor
const getAddedDoctor = async(req,res)=>{
    try{
        const {userUniqueId} = req.body
        if(!userUniqueId){
            return res.status(404).json({
                error:true,
                message:"User id is required"
            })
        }
            const findDoctor = await prisma.doctor_details.findMany({
                where:{
                    created_UId:userUniqueId
                }
            })
            console.log(findDoctor)

            //find userType
            const findUserType = await prisma.userData.findMany({
                where:{
                    uniqueId:userUniqueId
                },
                select:{
                    id:true,
                    role:true
                }
            })
            console.log({findUserType})
            const userRole = findUserType[0].role
            console.log({userRole})
            const mngrId = findUserType[0].id
            console.log({mngrId})
            if(userRole === "Manager"){
                //find doctor added by rep under the manager
                const findAddedRep = await prisma.userData.findMany({
                    where:{
                      createdBy:mngrId
                    },
                    select:{
                        id:true,
                        name:true,
                        role:true,
                        uniqueId:true
                    }
                })
                console.log({findAddedRep})
                
                //find dr added by rep
                const addedByRep = []
                  for(let i=0; i<findAddedRep.length;i++){
                    const userId = findAddedRep[i].uniqueId
                    console.log({userId})
          
              const findDr = await prisma.doctor_details.findMany({
                where:{
                      created_UId:userId
                }
            })
            console.log({findDr})
            addedByRep.push(findDr)
            }
               return res.status(200).json({
                error:false,
                success:true,
                message:"Successfull",
                data:findDoctor,
                addedByRep:addedByRep
            })
        }


    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}


//for getting travel plan for a day
const todaysTravelPlan = async(req,res)=>{
    try{
        const {date,userId} = req.body
        const todaysPlan = await prisma.detailedTravelPlan.findMany({
            where:{
                date:date,
                user_id:userId,
                status:"Approved"
            }
        })
        console.log({todaysPlan})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:todaysPlan
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

//adding schedule for doctor
const addSchedule = async(req,res)=>{
    try{
        const{drId,userId,schedule} = req.body
        const addScheduleData = await prisma.schedule.create({
           data:{
            dr_id:drId,
            user_id:userId,
            schedule:schedule
           }
        })
        console.log({addScheduleData})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully added the schedule details",
            data:addScheduleData
        })

    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}


//edit schedule
const editSchedule = async(req,res)=>{
    try{
        const{addressId,userId,drId,schedule} = req.body
        const date = new Date()
         
        //check the address
        const checkAddress = await prisma.doctor_address.findMany({
            where:{
                id:addressId
            }
        })

        if(checkAddress.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Address not found"
            })
        }
        const editedSchedule = await prisma.schedule.create({
           data:{
               dr_id:drId,
               user_id:userId,
               schedule:schedule,
               addressId:addressId,
               createdDate:date
            }
        })
        console.log({editedSchedule})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully edited the schedule",
            data:editedSchedule
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


//api for approving doctors
const approveDoctors = async(req,res)=>{
    try{
        const {dr_id,status} = req.body
        
        const approveDoctor = await prisma.doctor_details.update({
            where:{
                id:dr_id
            },
            data:{
                approvalStatus:status
            }
        })
        console.log({approveDoctor})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:approveDoctor
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

//getting dr for approval
const getDoctorList_forApproval = async(req,res)=>{
    try{
        const{userId} = req.body

        const findRep = await prisma.userData.findMany({
            where:{
                reportingOfficer_id:userId
            }
        })
        console.log({findRep})
        const rep = []
        for(let i=0; i<findRep.length ; i++){
            const userData = findRep[i].uniqueId
            console.log({userData})
            const findAddedRep = await prisma.doctor_details.findMany({
                where:{
                    created_UId:userData,
                    approvalStatus:"pending"
                }
            })
            console.log({findAddedRep})
             
        }

    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"Internal server error"
        })
    }
}




module.exports ={userRegistration,listArea,listDoctors,getAddedDoctor,todaysTravelPlan,addSchedule,editSchedule,approveDoctors,getDoctorList_forApproval}