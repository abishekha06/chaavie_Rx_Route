const express = require('express')
const server = express()
const cors = require('cors')
//for python
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');



var bodyParser = require('body-parser')
const managerRouter = require('./routes/manager/manager.routes')
const repRouter = require('./routes/rep/rep.routes')
const adminRouter = require('./routes/Admin/admin.route')
const userRouter = require('./routes/User/user.route');
const { PrismaClient } = require("@prisma/client");

// const { response } = require("express");
const prisma = new PrismaClient();



server.use(cors({
    origin: "*",
    allowedHeaders: "X-Requested-With,Content-Type,auth-token,Authorization",
    credentials: true
  }))
  server.use(express.json())
server.use(bodyParser.json())

server.use('/manager',managerRouter)
server.use('/rep',repRouter)
server.use('/admin',adminRouter)
server.use('/user',userRouter)



//python code

server.post('/generate-visit-plan', async (req, res) => {
  const { userId,month } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    // Wrap exec in a Promise to use it with async/await

    const findDr = await prisma.doctor_details.findMany({
      where:{
        created_UId:userId
      },
      select:{
        id:true,
        firstName:true,
        created_UId:true,
        visit_type:true
      }
    })
    console.log(findDr)

    const scheduleData = []
    for(let i=0; i<findDr.length ; i++){
      const doctorId = findDr[i].id
      const findAddress = await prisma.doctor_address.findMany({
        where:{
          doc_id:doctorId
        },
        select:{
          id:true,
          doc_id:true,
          userId:true,
          address:true,
          area:true
        }
      })
      console.log({findAddress})
      
      findAddress.forEach(address => {
        console.log('Address Details:', address.address);
        console.log('Address Content:', {
            address: address.address.address,
            latitude: address.address.latitude,
            longitude: address.address.longitude
        });
    });
      
      scheduleData.push({
        findDr:findDr[i],
        findAddress
      })
    }

    // res.status(200).json({
    //   error:false,
    //   success:true,
    //   message:"Successfull",
    //   data:scheduleData
    // })

   
    // Save scheduleData along with month to a temporary JSON file
    const scheduleDataPath = path.join(__dirname, 'scheduleData.json');
    const dataToSend = {
      scheduleData,
      month
    };
    fs.writeFileSync(scheduleDataPath, JSON.stringify(dataToSend, null, 2));

    // Execute the Python script and pass the path to the JSON file
    const executePythonScript = () => {
      return new Promise((resolve, reject) => {
        exec(`python python/travelplan.py ${scheduleDataPath}`, (error, stdout, stderr) => {
          if (error) {
            return reject(`Error executing script: ${error}`);
          }
          resolve(stdout);
        });
      });
    };

   // Wait for the Python script to complete
   const pythonOutput = await executePythonScript();

    // Return the generated travel plan (Python output)
    res.status(200).json({
      error: false,
      success: true,
      message: 'Successfully generated travel plan.',
      data: JSON.parse(pythonOutput) // Assuming Python returns a JSON response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating the visit plan.' });
  }
});


server.listen(3004,()=>{
    console.log("server started at http://localhost:3004")
})