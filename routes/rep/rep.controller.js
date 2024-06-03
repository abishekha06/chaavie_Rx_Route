const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//rep registration
const rep_registration = async (req, res) => {
    try {
        const { name, gender, dob, nationality, mobile, email, designation, qualification, reporting_officer, created_by ,address,type} = req.body
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
        const registration = await prisma.rep_details.create({
            data: {
                rep_name: name,
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
                type:type
            }
        })
        console.log({ registration })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfully added",
            data: registration
        })
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
           userLogin = await prisma.doctor_details.findMany({
            where:{
                unique_manager_code:userId,
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
                created_date:date
            }
        })
        res.status(200).json({
            error:true,
            success:false,
            message:"Successfull registered the doctor",
            data:dr_registration
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

//getting the doctors
const get_addedDoctors = async(req,res)=>{
    try{
        const{rep_UniqueId} = req.body
        const getDr = await prisma.doctor_details.findMany({
            where:{
                created_UId:rep_UniqueId
            }
        })
        console.log({getDr})
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














module.exports = { rep_registration,login,add_doctor,get_addedDoctors}