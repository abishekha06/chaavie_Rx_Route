const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//rep registration
const rep_registration = async (req, res) => {
    try {
        const { name, gender, dob, nationality, mobile, email, designation, qualification, reporting_officer, created_by ,address,type,password} = req.body
        const date = new Date()
        // const alphabets = "abcdefghijklmnopqrstuvwxyz"
        const numbers = '0123456789'
        let code = ''
        const prefix = 'Rep'
       
      
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
        if(name&&gender&&dob&&nationality&&mobile&&email&&designation&&qualification&&reporting_officer&&created_by&&address&&type&&password){
        const registration = await prisma.rep_details.create({
            data: {
                name: name,
                gender: gender,
                date_of_birth: dob,
                Nationality: nationality,
                mobile: mobile,
                email: email,
                designation: designation, 
                qualification: qualification,
                reporting_officer: reporting_officer,
                created_date: date,
                created_by: created_by,
                unique_id: code,
                address:address,
                type:type,
                password:password,
                status:"Active"
            }
        })
        console.log({ registration })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfully added",
            data: registration
        })
    }else{
        return res.status(404).json({
            error:true,
            success:false,
            message:'You missed some field'
        })
    }
    } catch (err) {
        console.log("error-----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//login 
const login = async(req,res)=>{
    try{
        const{userId,password} = req.body
        if(!userId || !password){
            return res.status(400).json({
                error:true,
                success:false,
                message:"UserId and password are required"
            })
        }
        let userLogin =[]
        if(userId.startsWith('Mngr')){
           userLogin = await prisma.manager_details.findMany({
            where:{
                unique_id:userId,
                password:password
            }
           })
        }else if(userId.startsWith('Rep')){
            userLogin = await prisma.rep_details.findMany({
                where:{
                    unique_id:userId,
                    password:password
                }
            })
        }else{
            return res.status(404).json({
                error:true,
                success:false,
                message:"invalid userid"
            })
        }
        if (userLogin.length === 0) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Invalid userId or password"
            });
        }
       
        return res.status(200).json({
            error:false,
            success:true,
            message:"successfully logined",
            data:userLogin
        })

    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"successfull",
        })
    }
}

//adding doctors
const add_doctor = async(req,res)=>{
    try{
        const{name,qualification,gender,specialization,mobile,visits,dob,wedding_date,products,chemist,created_UniqueId} = req.body
        const date = new Date()
        if(name&&qualification&&gender&&specialization&&mobile&&visits&&dob&&wedding_date&&products&&chemist&&created_UniqueId){
        const dr_registration = await prisma.doctor_details.create({
            data:{
                doc_name:name,
                doc_qualification:qualification,
                gender:gender,
                specialization:specialization,
                mobile:mobile,
                no_of_visits:visits,
                date_of_birth:dob,
                wedding_date:wedding_date,
                products:products,
                chemist:chemist,
                created_UId:created_UniqueId,
                created_date:date,
                status:"active"
            }
        })
        res.status(200).json({
            error:true,
            success:false,
            message:"Successfull registered the doctor",
            data:dr_registration
        })
    }else{
        return res.status(404).json({
            error:true,
            success:false,
            message:"You have missed some fields"
        })
    }
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//getting the doctors
const get_addedDoctors = async(req,res)=>{
    console.log({req})
    try{
        const{rep_UniqueId} = req.body
        if(!rep_UniqueId){
           return res.status(404).json({
                error:true,
                success:false,
                message:"Rep unique id is required"
            })
        }
        const getDr = await prisma.doctor_details.findMany({
            where:{
                created_UId:rep_UniqueId,
                status:"active"
            }
        })
        console.log({getDr})
        if(getDr.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Invalid unique id"
            })
        }
        if(rep_UniqueId.startsWith('Mngr')){
            const find_mngrDetails = await prisma.manager_details.findMany({
                where:{
                     unique_id:rep_UniqueId
                }
            })
            console.log({find_mngrDetails})
            const manager_id =find_mngrDetails[0].id
            console.log({manager_id})
            const find_rep = await prisma.rep_details.findMany({
                where:{
                    created_by:manager_id
                }
            })
            console.log({find_rep})
            const repaddedDR = []
            for(let i=0; i<find_rep.length ; i++){
                const rep_UniqueId = find_rep[0].unique_id
                console.log({rep_UniqueId})
                const find_addedDr = await prisma.doctor_details.findMany({
                    where:{
                        created_UId:rep_UniqueId
                    }
                })
                console.log({find_addedDr})
                repaddedDR.push({
                    addedBy_You:getDr,
                    addedByrep:find_addedDr
                })
            }
          return  res.status(200).json({
                error:false,
                success:true,
                message:"successfull",
                data:repaddedDR
            })
    
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:getDr
        })

    }catch(err){
        console.log("error----",err)
        res.status(400).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//getting the personal leave history
const leaveHistory  = async(req,res)=>{
    try{
        const{uniqueRequesterId} = req.body
        if(!uniqueRequesterId){
          return res.status(404).json({
            error:true,
            success:false,
            message:"RequesterID is missing"
          })
        }

        const find_leaveHistory = await prisma.leave_table.findMany({
            where:{
              uniqueRequester_Id:uniqueRequesterId
            }
        }) 
        console.log({find_leaveHistory})
        if(find_leaveHistory.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Provided invalid ID"
            })
        }
        if(uniqueRequesterId.startsWith("Rep")){
            const leaveRequestWithRepdetail = []
            for(let i=0 ; i<find_leaveHistory.length ; i++){
                console.log("jjjjj")
                const leaveRequest=find_leaveHistory[i]
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
          return  res.status(200).json({
                error:false,
                success:true,
                message:"Successfully collected the leave details",
                data:leaveRequestWithRepdetail
            })
        }else{
            const managerDetails = []
            for(let i=0 ; i<find_leaveHistory.length ; i++){
                console.log("jjjjj")
                const leaveRequest=find_leaveHistory[i]
                console.log({leaveRequest})
                const findRepdata = await prisma.manager_details.findMany({
                    where:{
                        unique_id:leaveRequest?.uniqueRequester_Id
                    }
                })
                console.log({findRepdata})
                managerDetails.push({
                    ...leaveRequest,
                    repDetails: findRepdata
                });
            }
          
        
          return  res.status(200).json({
                error:false,
                success:true,
                message:"Successfully collected the leave details",
                data:managerDetails
            })
        }
      
      

    }catch(err){
        console.log("error-----",err)
        res.status(404).status({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}


const single_Details = async(req,res)=>{
    try{
        const{uniqueId} = req.body

        if(!uniqueId){
            return res.status(404).json({
                error:true,
                success:false,
                message:"id required"
            })
        }
        let userArray = []
        if(uniqueId.startsWith('Mngr')){
            userArray = await prisma.manager_details.findMany({
                where:{
                    unique_id:uniqueId
                }
            })
        }else if(uniqueId.startsWith('Rep')){
            userArray = await prisma.rep_details.findMany({
                where:{
                    unique_id:uniqueId
                }
            })
        }else{
            return res.status(404).json({
                error:true,
                success:false,
                message:"Invalid Id"
            })
        }

        if(userArray.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"invalid id"
            })
        }
        res.status(200).json({
            error:true,
            success:false,
            message:"successfull",
            data:userArray
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

//for deleting the doctor
const delete_doctor = async(req,res)=>{
    try{
        const {dr_id} = req.body
        const delete_data = await prisma.doctor_details.update({
           where:{
            id:dr_id
           },
           data:{
            status:"inactive"
           }
        })
        console.log({delete_data})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully deleted the data",
            data:delete_data    
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

//searching dr according to their specialization
const filter_dr = async(req,res)=>{
    try{
        const {searchData} = req.body 
        const filter_data = await prisma.doctor_details.findMany({
            where:{
                OR:[
                    {
                        specialization:{
                            startsWith:searchData,
                            mode:'insensitive'
                        }
                    },
                    {
                       doc_name:{
                        startsWith: `Dr.${searchData}`,
                        mode:"insensitive"
                       } 
                    }
                ]
            }
        })
         console.log({filter_data})
         if(filter_data.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"No result found"
            })
         }
         res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:filter_data
         })
    }catch(err){
        console.log("error---",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//doctor detail
const get_doctorDetail = async(req,res)=>{
    try{
        const{dr_id} = req.body
        if(!dr_id){
            return res.status(404).json({
                error:true,
                success:false,
                message:'Doctor id is missing'
            })
        }
      const get_detail = await prisma.doctor_details.findFirst({
        where:{
            id:dr_id
        }
      })
      console.log({get_detail})
    //   if(get_detail === 'null'){
    //     return res.status(404).json({
    //         error:true,
    //         success:false,
    //         message:"Invalid doctor id"
    //     })
    //   }
    const doctor_data = []
    doctor_data.push({
        ...get_detail
    })
      res.status(200).json({
        error:false,
        success:true,
        message:"successfull",
        data:doctor_data
      })
    }catch(err){
        console.log("error-----",err)
        res.status(404).json
    }
}

//delete rep
const delete_rep = async(req,res)=>{
    try{
        const{rep_id} = req.body
        const delete_repData = await prisma.rep_details.update({
            where:{
                id:rep_id
            },
            data:{
                status:"Inactive"
            }

        })
        console.log({delete_repData})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully deleted the data",
            data:delete_repData
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

// report expense request
const report_expense = async(req,res)=>{
    try{
        const{amount,remarks,attachment,trip_date,doct_id,requesterId,uniqueRequesterId} = req.body
         const date = new Date()
         const expense_report = await prisma.expense_report.create({
            data:{
                amount:amount,
                remark:remarks,
                attachment:attachment,
                trip_date:trip_date,
                doct_id:doct_id,
                status:"Pending",
                requester_id:requesterId,
                uniqueRequesterId:uniqueRequesterId,
                created_date:date,
                
            }
         })
         const expense_id = expense_report.id
        //  console.log({expense_id})
         const repId = expense_report.requester_id
        //  console.log({repId})
        
        const find_reportingofficer = await prisma.rep_details.findMany({
           where:{
            id:repId
           }
        })
         
        // console.log({find_reportingofficer})
        const reporting_officer = find_reportingofficer[0]?.reporting_officer
        // console.log({reporting_officer})
        const add_officerId = await prisma.expense_report.update({
            where:{
                  id:expense_id
            },
            data:{
                reporting_officer:reporting_officer
            }
        })
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:add_officerId
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

//list expense request
const individual_expenseReport = async(req,res)=>{
    const {rep_uniqueid} = req.body
    try{
        const list_individualReport = await prisma.expense_report.findMany({
            where:{
                uniqueRequesterId:rep_uniqueid
            }
        })
        console.log({list_individualReport})
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:list_individualReport
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

//to add address of doctor
const add_drAddress = async(req,res)=>{
    try{
        const {dr_id, dr_address, latitude,longitude } = req.body
        const date = new Date()
        const add_address = await prisma.doctor_address.create({
            data:{
                doc_id:dr_id,
                address:dr_address,
                latitude:latitude,
                longitude:longitude,
                created_date:date
            }
        })
        console.log({add_address})
        res.status(200).json({
            error:false,
            success:true,
            message:"Address added successfully",
            data:add_address
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
//edit dr_address
const edit_drAddress = async(req,res)=>{
    try{

    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,

        })
    }
}

//total number of rep
const total_repCount = async(req,res)=>{
    try{
        const get_count = await prisma.rep_details.count()
        const lastestDate = await prisma.rep_details.findFirst({
          orderBy:{
            created_date:"desc"
          },
          select:{
            created_date:true
          }
        })
        const lastRepAddedDate = lastestDate?.created_date ? new Date(lastestDate.created_date).toISOString().split('T')[0] : null;
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            get_count:get_count,
            lastRepAddedDate:lastRepAddedDate
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

//total doctor count
const total_drCount = async(req,res)=>{
    try{
        const get_count = await prisma.doctor_details.count()
        const lastestDate = await prisma.doctor_details.findFirst({
          orderBy:{
            created_date:"desc"
          },
          select:{
            created_date:true
          }
        })
        const lastDrAddedDate = lastestDate?.created_date ? new Date(lastestDate.created_date).toISOString().split('T')[0] : null;
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            get_count:get_count,
            lastDrAddedDate:lastDrAddedDate
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

//api for searching the rep
const search_Rep = async(req,res)=>{
    try{
        const {searchName} = req.body
        const search_data = await prisma.rep_details.findMany({
           where:{
            name:{
                startsWith:searchName
            }
           }
        })
        console.log({search_data})
         res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:search_data
         })
    }catch(err){
        console.log("error------",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}


//add chemist
const add_chemist = async(req,res)=>{
    try{
        const{created_by,building_name,mobile,email,lisence_no,address,date_of_birth,uniqueId} = req.body
        const date = new Date()
        const create_chemist = await prisma.add_chemist.create({
            data:{
                created_by:created_by,
                unique_Id:uniqueId,
                building_name:building_name,
                mobile:mobile,
                email:email,
                license_number:lisence_no,
                address:address,
                date_of_birth:date_of_birth,
                // anniversary_date:anniversary_date,
                date_time:date,
                status:"Active"
            }
        })
        console.log({create_chemist})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:create_chemist
        })

    }catch(err){
        console.log("error---->",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//get chemist
const get_chemist = async(req,res)=>{
    try{
        const{uniqueId} = req.body
        const getData = await prisma.add_chemist.findMany({
            where:{
                unique_Id:uniqueId,
                status:"Active"

            }
        })
        console.log({getData})
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:getData
        })

    }catch(err){
        console.log("error----",err)
        res.status(400).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//delete chemist
const delete_chemist = async(req,res)=>{
    try{
        const{chemist_id} = req.body
        const change_status = await prisma.add_chemist.update({
            where:{
                id:chemist_id,
                
            },
            data:{
                status:"Inactive"
            }
        })
        console.log({change_status})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfully deleted",
            data:change_status
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

//search chemist
const search_chemist = async(req,res)=>{
    const{searchData} = req.body
    try{
        const searchResult = await prisma.add_chemist.findMany({
            where:{
               OR:[
                {
                    building_name:{
                        startsWith:searchData,
                        mode:"insensitive"
                  }
                },{
                    address:{
                        startsWith:searchData,
                        mode:"insensitive"
                    }
                }
               ]
            }
        })
        console.log({searchResult})
        if(searchResult.length === 0){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Not data found"
            })
        }else{
            return res.status(200).json({
                error:false,
                success:true,
                message:"Successfull",
                data:searchResult
            }) 
        }
    }catch(err){
        console.log("error----",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//edit chemist
const edit_chemist = async(req,res)=>{
    try{
        const{chemist_id,building_name,mobile,email,lisence_no,address,date_of_birth} = req.body

        const edited_data = await prisma.add_chemist.update({
            where:{
                id:chemist_id
            },
            data:{
                
                building_name:building_name,
                mobile:mobile,
                email:email,
                license_number:lisence_no,
                address:address,
                date_of_birth:date_of_birth,
               
                
            }
        })
        console.log({edited_data})
            res.status(200).json({
                error:false,
                success:true,
                message:"successfull",
                data:edited_data
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

//add product
const add_product = async(req,res)=>{
    try{
        const{created_by,products,quantity} = req.body
         const added_product = await prisma.add_product.create({
            data:{
                created_by:created_by,
                products:products,
                quantity:quantity,
                status:'Active'
            }
         })
         console.log({added_product})
         res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:added_product
        })
    }catch(err){
        console.log("error---",err)
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//delete product
const delete_product = async(req,res)=>{
    try{
        const{product_id} = req.body
        if(product_id){
         const deleted_product = await prisma.add_product.update({
            where:{
                id:product_id
            },
            data:{
               
                status:'Inctive'
            }
         })
         console.log({deleted_product})
         return res.status(200).json({
            error:false,
            success:true,
            message:"successfull deleted",
            data:deleted_product
        })
    }else{
        return res.status(404).json({
            error:true,
            message:"product id missing"
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


//get product
const get_product = async(req,res)=>{
    try{
        const{creater_id} = req.body
        const get_data = await prisma.add_product.findMany({
            where:{
                created_by:creater_id
            }
        })
          console.log({get_data})
          res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:get_data
        })
    }catch(err){
        console.log("error---",err)
        res.status(404).json({
            error:true,
            success:true,
            message:"internal server error"
        })
    }
}









module.exports = { rep_registration,login,add_doctor,get_addedDoctors,leaveHistory,single_Details,delete_doctor,filter_dr,get_doctorDetail,delete_rep,report_expense,
    individual_expenseReport,add_drAddress,total_repCount,total_drCount,search_Rep,add_chemist,get_chemist,delete_chemist,search_chemist,
    edit_chemist,add_product,delete_product,get_product}