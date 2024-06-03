const express = require('express')
const server = express()
const cors = require('cors')
var bodyParser = require('body-parser')
const managerRouter = require('./routes/manager/manager.routes')
const repRouter = require('./routes/rep/rep.routes')



server.use(cors({
    origin: "*",
    allowedHeaders: "X-Requested-With,Content-Type,auth-token,Authorization",
    credentials: true
  }))
  server.use(express.json())
server.use(bodyParser.json())

server.use('/manager',managerRouter)
server.use('/rep',repRouter)



server.listen(3004,()=>{
    console.log("server started at http://localhost:3004")
})