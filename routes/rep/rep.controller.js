const { PrismaClient } = require("@prisma/client");
// const { response } = require("express");
const prisma = new PrismaClient();

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    // const year = date.getFullYear();
    return `${day}-${month}`;
  }
  function formatnewDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const normalizeDate = (input) => {
    if (/^\d{8}$/.test(input)) {
      const day = input.slice(0, 2);
      const month = input.slice(2, 4);
      const year = input.slice(4, 8);
      return `${day}-${month}-${year}`;
    }
return input;
  };
  
  

//rep registration
const rep_registration = async (req, res) => {
    console.log({req})
    try {
        const { name, gender, dob, nationality, mobile, email, designation, qualification, reporting_officer, created_by, address, type, password,headquarters } = req.body
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
        console.log({ code })
        if (name && gender && dob && nationality && mobile && email && designation && qualification && reporting_officer && created_by && address && type && password && headquarters) {
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
                    address: address,
                    type: type,
                    password: password,
                    status: "Active",
                    headquarters:headquarters
                }
            })
            console.log({ registration })
            res.status(200).json({
                error: false,
                success: true,
                message: "successfully added",
                data: registration
            })
        } else {
            return res.status(404).json({
                error: true,
                success: false,
                message: 'You missed some field'
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
const login = async (req, res) => {
    try {
        const { userId, password } = req.body
        if (!userId || !password) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "UserId and password are required"
            })
        }
        let userLogin = []
        if (userId.startsWith('Mngr')) {
            userLogin = await prisma.manager_details.findMany({
                where: {
                    unique_id: userId,
                    password: password
                }
            })
        } else if (userId.startsWith('Rep')) {
            userLogin = await prisma.rep_details.findMany({
                where: {
                    unique_id: userId,
                    password: password
                }
            })
        } else {
            return res.status(404).json({
                error: true,
                success: false,
                message: "invalid userid"
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
            error: false,
            success: true,
            message: "successfully logined",
            data: userLogin
        })

    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "successfull",
        })
    }
}

//adding doctors
// const add_doctor = async (req, res) => {
//     console.log(req.body.address)
//     // console.log({req})
//     try {
//         const { name, qualification, gender, specialization, mobile, visits, dob, wedding_date, products, chemist, created_UniqueId, latitude, longitude, address } = req.body
//         const date = new Date()
//         if (name && qualification && gender && specialization && mobile && visits && dob && wedding_date && products && chemist && created_UniqueId) {
//             const dr_registration = await prisma.doctor_details.create({
//                 data: {
//                     doc_name: name,
//                     doc_qualification: qualification,
//                     gender: gender,
//                     specialization: specialization,
//                     mobile: mobile,
//                     no_of_visits: visits,
//                     date_of_birth: dob,
//                     wedding_date: wedding_date,
//                     products: products,
//                     chemist: chemist,
//                     created_UId: created_UniqueId,
//                     created_date: date,
//                     status: "active"
//                     // headquarters_id:headquarters_id
//                 }
//             })
//             console.log({ dr_registration })
//             const doc_id = dr_registration.id
//             const address_ID = []
//             const addedAddress = []
//             for (let i = 0; i < address.length; i++) {
//                 // const currentAddress = dr_registration[i]
//                 // console.log({currentAddress})
//                 const add_drAddress = await prisma.doctor_address.create({
//                     data: {
//                         doc_id: doc_id,
//                         address: address[i],
//                         // latitude:address.latitude,
//                         // longitude:address.longitude,
//                         created_date: date
//                     }
//                 })
//                 console.log({ add_drAddress })
//                 address_ID.push(add_drAddress.id)
//                 addedAddress.push(add_drAddress)
//             }

//             //  const address_id = add_drAddress.id
//             const add_addressID = await prisma.doctor_details.update({
//                 where: {
//                     id: doc_id
//                 },
//                 data: {
//                     address_id: address_ID
//                 }
//             })
//             console.log({ add_addressID })
//             //adding total visits in visit_record table
//             const addVisits = await prisma.visit_record.create({
//                data:{
//                 requesterUniqueId:created_UniqueId,
//                 dr_Id:doc_id,
//                 total_visits:visits
//                }
//             })
//             console.log({addVisits})
//             res.status(200).json({
//                 error: true,
//                 success: false,
//                 message: "Successfull registered the doctor",
//                 data: dr_registration,
//                 addedAddress: addedAddress
//             })
//         } else {
//             return res.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "You have missed some fields"
//             })
//         }
//     } catch (err) {
//         console.log("error----", err)
//         res.status(404).json({
//             error: true,
//             success: false,
//             message: "internal server error"
//         })
//     }
// }
const add_doctor = async (req, res) => {
    console.log({req})
    try {
        const { name, qualification, gender, specialization, mobile, visits, dob, wedding_date, products, chemist, created_UniqueId, latitude, longitude, address } = req.body
        const date = new Date()
        if (name && qualification && gender && specialization && mobile && visits && dob && wedding_date && products && chemist && created_UniqueId) {
            const dr_registration = await prisma.doctor_details.create({
                data: {
                    doc_name: name,
                    doc_qualification: qualification,
                    gender: gender,
                    specialization: specialization,
                    mobile: mobile,
                    no_of_visits: visits,
                    date_of_birth: dob,
                    wedding_date: wedding_date,
                    products: products,
                    chemist: chemist,
                    created_UId: created_UniqueId,
                    created_date: date,
                    status: "active"
                }
            })
            console.log({ dr_registration })
            const doc_id = dr_registration.id
            const address_ID = []
            const addedAddress = []
            for (let i = 0; i < address.length; i++) {
                const add_drAddress = await prisma.doctor_address.create({
                    data: {
                        doc_id: doc_id,
                        address: address[i],
                        created_date: date
                    }
                })
                console.log({ add_drAddress })
                address_ID.push(add_drAddress.id)
                addedAddress.push(add_drAddress)
            }

            const add_addressID = await prisma.doctor_details.update({
                where: {
                    id: doc_id
                },
                data: {
                    address_id: address_ID
                }
            })
            console.log({ add_addressID })
            // const addVisits = await prisma.visit_record.create({
            //    data:{
            //     requesterUniqueId: created_UniqueId,
            //     dr_Id: doc_id,
            //     total_visits: visits
            //    }
            // })
            // console.log({ addVisits })
            res.status(200).json({
                error: true,
                success: false,
                message: "Successfully registered the doctor",
                data: dr_registration,
                addedAddress: addedAddress
            })
        } else {
            return res.status(404).json({
                error: true,
                success: false,
                message: "You have missed some fields"
            })
        }
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "Internal server error"
        })
    }
}

//getting the doctors
// const get_addedDoctors = async (req, res) => {
//     console.log({ req })
//     try {
//         const { rep_UniqueId } = req.body
//         if (!rep_UniqueId) {
//             return res.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "Rep unique id is required"
//             })
//         }
//         const getDr = await prisma.doctor_details.findMany({
//             where: {
//                 created_UId: rep_UniqueId,
//                 status: "active"
//             }
//         })
//         console.log({ getDr })
//         if (getDr.length === 0) {
//             return res.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "Invalid unique id, No data found"
//             })
//         }
//         if (rep_UniqueId.startsWith('Mngr')) {
//             const find_mngrDetails = await prisma.manager_details.findMany({
//                 where: {
//                     unique_id: rep_UniqueId
//                 }
//             })
//             console.log({ find_mngrDetails })
//             const manager_id = find_mngrDetails[0].id
//             console.log({ manager_id })
//             const find_rep = await prisma.rep_details.findMany({
//                 where: {
//                     created_by: manager_id
//                 }
//             })
//             console.log({ find_rep })
//             const repaddedDR = []
//             for (let i = 0; i < find_rep.length; i++) {
//                 const rep_UniqueId = find_rep[0].unique_id
//                 console.log({ rep_UniqueId })
//                 const find_addedDr = await prisma.doctor_details.findMany({
//                     where: {
//                         created_UId: rep_UniqueId
//                     }
//                 })
//                 console.log({ find_addedDr })
//                 repaddedDR.push({
//                     addedbyYou:getDr,
//                     addedByRep:find_addedDr
//                 })
//             // repaddedDR.push(...getDr,...find_addedDr)
//             }
//             return res.status(200).json({
//                 error: false,
//                 success: true,
//                 message: "successfull",
//                 datas: repaddedDR
//             })
        
//         }
//         //stop here
//         res.status(200).json({
//             error: false,
//             success: true,
//             message: "successfull",
//             data: getDr
//         })

//     } catch (err) {
//         console.log("error----", err)
//         res.status(400).json({
//             error: true,
//             success: false,
//             message: "internal server error"
//         })
//     }
// }
const get_addedDoctors = async (req, res) => {
    console.log({ req })
    try {
        const { rep_UniqueId } = req.body;
        if (!rep_UniqueId) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Rep unique id is required"
            });
        }

        const getDr = await prisma.doctor_details.findMany({
            where: {
                created_UId: rep_UniqueId,
                status: "active"
            }
        });
        console.log({ getDr });

        // if (getDr.length === 0) {
        //     return res.status(404).json({
        //         error: true,
        //         success: false,
        //         message: "Invalid unique id, No data found"
        //     });
        // }

        if (rep_UniqueId.startsWith('Mngr')) {
            const find_mngrDetails = await prisma.manager_details.findMany({
                where: {
                    unique_id: rep_UniqueId
                }
            });
            console.log({ find_mngrDetails });

            if (find_mngrDetails.length === 0) {
                return res.status(404).json({
                    error: true,
                    success: false,
                    message: "Manager not found"
                });
            }

            const manager_id = find_mngrDetails[0].id;
            console.log({ manager_id });

            const find_rep = await prisma.rep_details.findMany({
                where: {
                    created_by: manager_id
                }
            });
            console.log({ find_rep });

            const repaddedDR = [...getDr];
            for (let i = 0; i < find_rep.length; i++) {
                const rep_UniqueId = find_rep[i].unique_id;
                console.log({ rep_UniqueId });

                const find_addedDr = await prisma.doctor_details.findMany({
                    where: {
                        created_UId: rep_UniqueId,
                        status: "active"
                    }
                });
                console.log({ find_addedDr });

                repaddedDR.push(...find_addedDr);
            }

            return res.status(200).json({
                error: false,
                success: true,
                message: "Successful",
                data: repaddedDR
            });
        }

        // If not a manager, just return getDr
        res.status(200).json({
            error: false,
            success: true,
            message: "Successful",
            data: getDr
        });

    } catch (err) {
        console.log("error----", err);
        res.status(400).json({
            error: true,
            success: false,
            message: "Internal server error"
        });
    }
};



//getting the personal leave history
const leaveHistory = async (req, res) => {
    try {
        const { uniqueRequesterId } = req.body
        if (!uniqueRequesterId) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "RequesterID is missing"
            })
        }

        const find_leaveHistory = await prisma.leave_table.findMany({
            where: {
                uniqueRequester_Id: uniqueRequesterId
            }
        })
        console.log({ find_leaveHistory })
        if (find_leaveHistory.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Provided invalid ID"
            })
        }
        if (uniqueRequesterId.startsWith("Rep")) {
            const leaveRequestWithRepdetail = []
            for (let i = 0; i < find_leaveHistory.length; i++) {
                console.log("jjjjj")
                const leaveRequest = find_leaveHistory[i]
                console.log({ leaveRequest })
                const findRepdata = await prisma.rep_details.findMany({
                    where: {
                        unique_id: leaveRequest?.uniqueRequester_Id
                    }
                })
                console.log({ findRepdata })
                leaveRequestWithRepdetail.push({
                    ...leaveRequest,
                    repDetails: findRepdata
                });
            }
            return res.status(200).json({
                error: false,
                success: true,
                message: "Successfully collected the leave details",
                data: leaveRequestWithRepdetail
            })
        } else {
            const managerDetails = []
            for (let i = 0; i < find_leaveHistory.length; i++) {
                console.log("jjjjj")
                const leaveRequest = find_leaveHistory[i]
                console.log({ leaveRequest })
                const findRepdata = await prisma.manager_details.findMany({
                    where: {
                        unique_id: leaveRequest?.uniqueRequester_Id
                    }
                })
                console.log({ findRepdata })
                managerDetails.push({
                    ...leaveRequest,
                    repDetails: findRepdata
                });
            }


            return res.status(200).json({
                error: false,
                success: true,
                message: "Successfully collected the leave details",
                data: managerDetails
            })
        }



    } catch (err) {
        console.log("error-----", err)
        res.status(404).status({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}


const single_Details = async (req, res) => {
    try {
        const { uniqueId } = req.body

        if (!uniqueId) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "id required"
            })
        }
        let userArray = []
        if (uniqueId.startsWith('Mngr')) {
            userArray = await prisma.manager_details.findMany({
                where: {
                    unique_id: uniqueId
                }
            })
        } else if (uniqueId.startsWith('Rep')) {
            userArray = await prisma.rep_details.findMany({
                where: {
                    unique_id: uniqueId
                }
            })
        } else {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Invalid Id"
            })
        }

        if (userArray.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "invalid id"
            })
        }
        res.status(200).json({
            error: true,
            success: false,
            message: "successfull",
            data: userArray
        })
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//for deleting the doctor
const delete_doctor = async (req, res) => {
    try {
        const { dr_id } = req.body
        const delete_data = await prisma.doctor_details.update({
            where: {
                id: dr_id
            },
            data: {
                status: "inactive"
            }
        })
        console.log({ delete_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfully deleted the data",
            data: delete_data
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

//searching dr according to their specialization
const filter_dr = async (req, res) => {
    try {
        const { searchData } = req.body
        const filter_data = await prisma.doctor_details.findMany({
            where: {
                OR: [
                    {
                        specialization: {
                            startsWith: searchData,
                            mode: 'insensitive'
                        }
                    },
                    {
                        doc_name: {
                            startsWith: `Dr.${searchData}`,
                            mode: "insensitive"
                        }
                    }
                ],
                status:"active"
            }
        })
        console.log({ filter_data })
        if (filter_data.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "No result found"
            })
        }
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: filter_data
        })
    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//doctor detail
const get_doctorDetail = async (req, res) => {
    try {
        const { dr_id } = req.body
        if (!dr_id) {
            return res.status(404).json({
                error: true,
                success: false,
                message: 'Doctor id is missing'
            })
        }
        const get_detail = await prisma.doctor_details.findFirst({
            where: {
                id: dr_id
            }
        })
        console.log({ get_detail })
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
            error: false,
            success: true,
            message: "successfull",
            data: doctor_data
        })
    } catch (err) {
        console.log("error-----", err)
        res.status(404).json
    }
}

//delete rep
const delete_rep = async (req, res) => {
    try {
        const { rep_id } = req.body
        const delete_repData = await prisma.rep_details.update({
            where: {
                id: rep_id
            },
            data: {
                status: "Inactive"
            }

        })
        console.log({ delete_repData })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfully deleted the data",
            data: delete_repData
        })

    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

// report expense request
const report_expense = async (req, res) => {
    try {
        const { amount, remarks, attachment, trip_date, doct_id, requesterId, uniqueRequesterId } = req.body
        const date = new Date()
        const expense_report = await prisma.expense_report.create({
            data: {
                amount: amount,
                remark: remarks,
                attachment: attachment,
                trip_date: trip_date,
                doct_id: doct_id,
                status: "Pending",
                requester_id: requesterId,
                uniqueRequesterId: uniqueRequesterId,
                created_date: date,

            }
        })
        const expense_id = expense_report.id
        //  console.log({expense_id})
        const repId = expense_report.requester_id
        //  console.log({repId})

        const find_reportingofficer = await prisma.rep_details.findMany({
            where: {
                id: repId
            }
        })

        // console.log({find_reportingofficer})
        const reporting_officer = find_reportingofficer[0]?.reporting_officer
        // console.log({reporting_officer})
        const add_officerId = await prisma.expense_report.update({
            where: {
                id: expense_id
            },
            data: {
                reporting_officer: reporting_officer
            }
        })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: add_officerId
        })
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//list expense request
const individual_expenseReport = async (req, res) => {
    const { uniqueid,searchData } = req.body
    try {
        if(!searchData){
        const list_individualReport = await prisma.expense_report.findMany({
            where: {
                uniqueRequesterId: uniqueid
            }
        })
        
        console.log({ list_individualReport })
        const completeExpenseData = []
        for(let i=0; i<list_individualReport.length ;i++){
            const getExpenseReport = list_individualReport[i]
           
            const drId = getExpenseReport.doct_id
            console.log({drId})
            const drDetails = await prisma.doctor_details.findMany({
                where:{
                    id:drId
                },
                select:{
                    id:true,
                    doc_name:true
                }
            }) 
            console.log({drDetails})
            completeExpenseData.push({
                ...getExpenseReport,
                doctorDetails:drDetails
            })
        }
        //find rep_details
        if(uniqueid.startsWith('Rep')){
        const rep_details = await prisma.rep_details.findMany({
            where:{
                unique_id:uniqueid
            }
        })
       return res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: list_individualReport,
            rep_details:rep_details
        })
    }else{

        const managerDetails = await prisma.manager_details.findMany({
            where:{
                unique_id:uniqueid
            }
        })
       return res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: completeExpenseData,
            managerDetails:managerDetails
        })
    }
}else{
    const findDr = await prisma.doctor_details.findMany({
        where:{
            created_UId:uniqueid,
           
            doc_name:{
                startsWith:searchData,
                mode:"insensitive"
            }
        },
        select:{
            id:true,
            // doc_name:true
        }
    })
    console.log({findDr})
    // const doctorId = []
    
    for( let i=0; i<findDr.length ; i++){
        const doctorID = findDr[i].id
        // console.log({doctorID} )
        const doctorExpense = await prisma.expense_report.findMany({
               where:{
                doct_id:doctorID[i],
                uniqueRequesterId:uniqueid
               }
        })
        console.log({doctorExpense})
        // doctorId.push(doctorExpense)
        return res.status(200).json({
            erorr:true,
            success:false,
            message:"Successfull",
            data:doctorExpense
        })
    }
    const dateFormat = normalizeDate(searchData)
    const searchExpense = await prisma.expense_report.findMany({
        where:{
            uniqueRequesterId: uniqueid,
            OR:[
                {
                    amount:{
                        startsWith:searchData
                    }
                },{
                    trip_date:{
                        startsWith:dateFormat
                    }
                }
            ]
        }
    })
    console.log({searchExpense})
    return res.status(200).json({
        error:true,
        success:false,
        message:"Successfull",
        data:searchExpense
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

//to add address of doctor
const add_drAddress = async (req, res) => {
    try {
        const { dr_id, dr_address, latitude, longitude } = req.body
        const date = new Date()
        const add_address = await prisma.doctor_address.create({
            data: {
                doc_id: dr_id,
                address: dr_address,
                latitude: latitude,
                longitude: longitude,
                created_date: date
            }
        })
        console.log({ add_address })
        res.status(200).json({
            error: false,
            success: true,
            message: "Address added successfully",
            data: add_address
        })
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}
//edit dr_address
// const edit_drAddress = async (req, res) => {
//     try {

//     } catch (err) {
//         console.log("error----", err)
//         res.status(404).json({
//             error: true,
//             success: false,

//         })
//     }
// }

//total number of rep
const total_repCount = async (req, res) => {
    try {
        const get_count = await prisma.rep_details.count()
        const lastestDate = await prisma.rep_details.findFirst({
            orderBy: {
                created_date: "desc"
            },
            select: {
                created_date: true
            }
        })
        const lastRepAddedDate = lastestDate?.created_date ? new Date(lastestDate.created_date).toISOString().split('T')[0] : null;
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            get_count: get_count,
            lastRepAddedDate: lastRepAddedDate
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

//total doctor count
const total_drCount = async (req, res) => {
    try {
        const get_count = await prisma.doctor_details.count()
        const lastestDate = await prisma.doctor_details.findFirst({
            orderBy: {
                created_date: "desc"
            },
            select: {
                created_date: true
            }
        })
        const lastDrAddedDate = lastestDate?.created_date ? new Date(lastestDate.created_date).toISOString().split('T')[0] : null;
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            get_count: get_count,
            lastDrAddedDate: lastDrAddedDate
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

//api for searching the rep
const search_Rep = async (req, res) => {
    try {
        const { searchName } = req.body
        const search_data = await prisma.rep_details.findMany({
            where: {
                name: {
                    startsWith: searchName
                }
            }
        })
        console.log({ search_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: search_data
        })
    } catch (err) {
        console.log("error------", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}


//add chemist
const add_chemist = async (req, res) => {
    try {
        const { created_by, building_name, mobile, email, lisence_no, address, date_of_birth, uniqueId } = req.body
        const date = new Date()
        const create_chemist = await prisma.add_chemist.create({
            data: {
                created_by: created_by,
                unique_Id: uniqueId,
                building_name: building_name,
                mobile: mobile,
                email: email,
                license_number: lisence_no,
                address: address,
                date_of_birth: date_of_birth,
                // anniversary_date:anniversary_date,
                date_time: date,
                status: "Active"
            }
        })
        console.log({ create_chemist })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfull",
            data: create_chemist
        })

    } catch (err) {
        console.log("error---->", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//get chemist
const get_chemist = async (req, res) => {
    try {
        // const { uniqueId } = req.body
        const getData = await prisma.add_chemist.findMany({
            orderBy:{
                date_time:"desc"
            },
            where:{
                status:"Active"
            }
        })
        console.log({ getData })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: getData
        })

    } catch (err) {
        console.log("error----", err)
        res.status(400).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//delete chemist
const delete_chemist = async (req, res) => {
    try {
        const { chemist_id } = req.body
        const change_status = await prisma.add_chemist.update({
            where: {
                id: chemist_id,

            },
            data: {
                status: "Inactive"
            }
        })
        console.log({ change_status })
        res.status(200).json({
            error: false,
            success: true,
            message: "Successfully deleted",
            data: change_status
        })

    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//search chemist
const search_chemist = async (req, res) => {
    const { searchData } = req.body
    try {
        const searchResult = await prisma.add_chemist.findMany({
            where: {
                OR: [
                    {
                        building_name: {
                            startsWith: searchData,
                            mode: "insensitive"
                        }
                    }, { 
                        address: {
                            startsWith: searchData,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        })
        console.log({ searchResult })
        if (searchResult.length === 0) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Not data found"
            })
        } else {
            return res.status(200).json({
                error: false,
                success: true,
                message: "Successfull",
                data: searchResult
            })
        }
    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//edit chemist
const edit_chemist = async (req, res) => {
    try {
        const { chemist_id, building_name, mobile, email, lisence_no, address, date_of_birth } = req.body

        const edited_data = await prisma.add_chemist.update({
            where: {
                id: chemist_id
            },
            data: {

                building_name: building_name,
                mobile: mobile,
                email: email,
                license_number: lisence_no,
                address: address,
                date_of_birth: date_of_birth,


            }
        })
        console.log({ edited_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: edited_data
        })


    } catch (err) {
        console.log("error----", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//add product
const add_product = async (req, res) => {
    try {
        const { created_by, productName, quantity } = req.body
        const added_product = await prisma.add_product.create({
            data: {
                created_by: created_by,
                product_name: productName,
                quantity: quantity,
                status: 'Active'
            }
        })
        console.log({ added_product })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: added_product
        })
    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}

//delete product
const delete_product = async (req, res) => {
    try {
        const { productId } = req.body
        if (productId) {
            const deleted_product = await prisma.add_product.update({
                where: {
                    id: productId
                },
                data: {

                    status: 'Inactive'
                }
            })
            console.log({ deleted_product })
            return res.status(200).json({
                error: false,
                success: true,
                message: "successfull deleted",
                data: deleted_product
            })
        } else {
            return res.status(404).json({
                error: true,
                message: "product id missing"
            })
        }
    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: false,
            message: "internal server error"
        })
    }
}


//get product
const get_product = async (req, res) => {
    try {
        // const{creater_id} = req.body
        const get_data = await prisma.add_product.findMany({
            where:{
                status:"Active"
            }
        })
        console.log({ get_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: get_data
        })
    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: true,
            message: "internal server error"
        })
    }
}

//edit product
 const editProduct = async(req,res)=>{
    try{
        const{productId,productName} = req.body
        const product = await prisma.add_product.update({
            where:{
                id:productId
            },
            data:{
                product_name:productName
            }
        })
           console.log({product})
           res.status(200).json({
            error:false,
            success:true,
            message:"Successfully edited the product",
            data:product
           })
    }catch(err){
         res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
         })
    }
 }

//get headquarters
const get_headquarters = async (req, res) => {
    try {
        const all_data = await prisma.headquarters.findMany()
        console.log({ all_data })
        res.status(200).json({
            error: false,
            success: true,
            message: "successfull",
            data: all_data
        })

    } catch (err) {
        console.log("error---", err)
        res.status(404).json({
            error: true,
            success: true,
            message: "internal server error"
        })
    }
}

const travel_plan = async(req,res)=>{
    try{
        const {requester_id,date_headquarters}=req.body
        const travel_planData =[] 
        for(let i=0; i<date_headquarters.length ; i++){
       
        const date = new Date()
        const add_travelPlan = await prisma.travel_plan.create({
          data:{
            requester_id:requester_id,
            headquarters_date:date_headquarters[i],
            created_date:date,
            status:"Pending"
          }
        })

        console.log(add_travelPlan)
        travel_planData.push(add_travelPlan)
    }
    res.status(200).json({
        error:false,
        success:true,
        message:"successfull",
        data:travel_planData
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

//get travel_plan
const get_travelPlan = async(req,res)=>{
    try{
        const{requesterId} = req.body
        if(!requesterId){
            return res.status(404).json({
                error:true,
                success:false,
                message:"Requester id is required"
            })
        }
         const get_plan = await prisma.travel_plan.findMany({
            where:{
                requester_id:requesterId,
                // status:"Pending"
            }
         })
         console.log({get_plan})
         res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:get_plan
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


//getting birthday and anniversary notifications
const notifications = async(req,res)=>{
    try{
        
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedTomorrow = formatDate(tomorrow);
        console.log({formattedTomorrow})


        const today = new Date()
        const formattedToday = formatDate(today)
        console.log({formattedToday})

        const BirthdayNotification = await prisma.doctor_details.findMany({
            where:{
                date_of_birth:{
                    startsWith:formattedTomorrow
                }
            }
        })
        const findAnniversary = await prisma.doctor_details.findMany({
            where:{
              wedding_date:{
                startsWith:formattedTomorrow
              }  
            }
        })
        console.log({findAnniversary})
        
        const birthdayToday = await prisma.doctor_details.findMany({
            where:{
                date_of_birth:{
                    startsWith:formattedToday
                }
            }
        })
        console.log({birthdayToday})
        const anniversaryToday = await prisma.doctor_details.findMany({
            where:{
              wedding_date:{
                startsWith:formattedToday
              }  
            }
        })
        console.log({anniversaryToday})
        const notifications = []
        const todayEvents = []
        todayEvents.push({
            todayBirthday :birthdayToday,
            todayAnniversary :anniversaryToday
        })
        notifications.push({
            BirthdayNotification:BirthdayNotification,
            AnniversaryNotification:findAnniversary
        })
       
        res.status(200).json({
            error:false,
            success:true,
            // message:`Hey its ${BirthdayNotification.doc_name} Birthday!,Wish her all the best`,
            message:"Successfull",
            UpcomingEvents:notifications,
            todayEvents:todayEvents
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

//search in leave balance table 
const searchByDate = async(req,res)=>{
    try{
        const{user_uniqueId,date} = req.body
        if(user_uniqueId && date){
            const getSearchData = await prisma.leave_table.findMany({
                where:{
                    uniqueRequester_Id:user_uniqueId,
                    OR:[
                        {
                            from_date:{
                                startsWith:date
                            }
                        },
                        {
                            to_date:{
                                endsWith:date
                            }
                        }
                    ]
                }
            }) 
            console.log({getSearchData})
            res.status(200).json({
                error:false,
                success:true,
                message:"Successfull",
                data:getSearchData
            })
            if(getSearchData.length === 0){
               return res.status(400).json({
                    error:false,
                    success:true,
                    message:"No result found",
                  
                }) 
            }
        }else{
            return res.status(404).json({
                error:true,
                success:false,
                message:"Invalid Id provided",
              
            }) 
        }
      
      
    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//search in expense table
const search_expenseTable = async(req,res)=>{
    try{
        const {user_uniqueID,searchdata} = req.body
        if(!user_uniqueID){
            return res.status(404).json({
                error:true,
                success:false,
                message:"User ID id required"

            })
        }else{
            //finding the doctor details first
            const findDr = await prisma.doctor_details.findMany({
                where:{
                    created_UId:user_uniqueID,
                    doc_name:{
                        startsWith:searchdata,
                        mode:"insensitive"
                    }
                },
                select:{
                    id:true,
                    // doc_name:true
                }
            })
            console.log({findDr})
            // const doctorId = []
            
            for( let i=0; i<findDr.length ; i++){
                const doctorID = findDr[i].id
                // console.log({doctorID})
                const doctorExpense = await prisma.expense_report.findMany({
                       where:{
                        doct_id:doctorID[i],
                        uniqueRequesterId:user_uniqueID
                       }
                })
                console.log({doctorExpense})
                // doctorId.push(doctorExpense)
                return res.status(200).json({
                    erorr:true,
                    success:false,
                    message:"Successfull",
                    data:doctorExpense
                })
            }
            // console.log({doctorId})
        const findSearchData = await prisma.expense_report.findMany({
            where:{
                uniqueRequesterId:user_uniqueID,
                OR:[
                    {
                        amount:{
                            startsWith:searchdata
                        }
                    },
                    {
                        trip_date:{
                            startsWith:searchdata   
                        }
                    },
                    {

                    }
                ]
            }
        })
        console.log({findSearchData})
        return res.status(200).json({
            erorr:true,
            success:false,
            message:"Successfull",
            data:doctorExpense
        })
    
    }
    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//mark as visited
const markAsVisited = async(req,res)=>{
    try{
        const{reporterUniqueId,reporterId,date,time,products,remark,doctorId} = req.body
        const currentDate =new Date()
        const markVisited = await prisma.reporting_details.create({
             data:{
                unique_reqId:reporterUniqueId,
                date:date,
                time:time,
                products:products,
                remarks:remark,
                rep_id:reporterId,
                doctor_id:doctorId,
                datetime:currentDate
             }
        })
        console.log({markVisited})

        const visitedId = markVisited.id
        let visitReport
        if(date && time){
            visitReport = await prisma.reporting_details.update({
                where:{
                    id:visitedId
                },
                data:{
                    reporting_type:"Online Reporting"
                }
            })
        }else{
            visitReport = await prisma.reporting_details.update({
                where:{
                    id:visitedId
                },
                data:{
                    reporting_type:"Offline Reporting"
                }
            })
        }
        //for getting the count of lines
        const countVisits = await prisma.reporting_details.count({
            where:{
                unique_reqId:reporterUniqueId,
                doctor_id:doctorId
            }
        })
        console.log({countVisits})
        const getVisitReport = await prisma.doctor_details.findFirst({
            where:{
                created_UId:reporterUniqueId,
                id:doctorId
            },
            select:{
                no_of_visits:true
            }
        })
        console.log({getVisitReport})
        const visitCount = getVisitReport.no_of_visits
        const balanceVisit = visitCount-countVisits
        console.log({balanceVisit})
        const findVisitRecord = await prisma.visit_record.findFirst({
            where:{
                requesterUniqueId:reporterUniqueId,
                dr_Id:doctorId
            },
            select:{
                id:true
            }
        })
        console.log({findVisitRecord})
        const visitID = findVisitRecord.id
        console.log({visitID})
        if(!findVisitRecord){
            return res.status(404).json({
                error:true,
                success:false,
                message:"No visit record found"
            })
        }
        const updateVisit = await prisma.visit_record.update({
            where:{
               id:visitID
            },
            data:{
              requesterId:reporterId,
              visited:countVisits,
              balance_visit:balanceVisit
            }
        })
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:visitReport,
            updateVisit:updateVisit
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

//get visit report
const getVisitReport = async(req,res)=>{
    try{
        const visitReport = await prisma.reporting_details.findMany()
        console.log({visitReport})
         
        const completeReportData = []
        for(let i=0;i<visitReport.length;i++){
            const reportData = visitReport[i]
            const dr_id = reportData.doctor_id
            // console.log({dr_id})
            const requesterUniqueId = reportData.unique_reqId
            // console.log({requesterUniqueId})
            const findVisitData = await prisma.visit_record.findMany({
                where:{
                    requesterUniqueId:requesterUniqueId,
                    dr_Id:dr_id
                }
            })
            const findDoctorDetails =  await prisma.doctor_details.findMany({
                where:{
                    id:dr_id
                },
                select:{
                    id:true,
                    doc_name:true,
                    doc_qualification:true
                }
            })
            completeReportData.push({
                ReportDetails:visitReport[i],
                doctorDetails:findDoctorDetails,
                VisitDetails:findVisitData
         } )
        }
        res.status(200).json({
            error:false,
            success:true,
            message:"successfull",
            data:completeReportData
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

//single chemist details
const singleChemistDetail = async(req,res)=>{
    try{
        const{chemistId} = req.body
        if(chemistId){
        const singleData = await prisma.add_chemist.findUnique({
            where:{
                id:chemistId
            }
        })
        console.log({singleData})
       return res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:singleData
        })
    }else{
        return res.status(404).json({
            error:true,
            success:false,
            message:"Chemist Id is required"
        })
    }
    }catch(err){
        console.log({err})
        res.status(404).json({
            error:true,
            success:false,
            message:"internal server error"
        })
    }
}

//getting dr visited days
const visitedDays = async(req,res)=>{
    try{
        const{uniqueRequesterId,drId} = req.body
    
        const getDate = await prisma.reporting_details.findMany({
            where:{
                unique_reqId:uniqueRequesterId,
                doctor_id:drId
            },
            select:{
                id:true,
                datetime:true
            }
        })
        const visitedData = []
        for(i=0; i<getDate.length; i++){
            const dateData = getDate[i].datetime
            // console.log({dateData})
            const extractDate = (dateData) => {
                const date = new Date(dateData);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); 
                const day = String(date.getDate()).padStart(2, '0');
                return `${day}-${month}-${year}`;
              };
              const dateOnly = extractDate(dateData)
            //   console.log({dateOnly})
              visitedData.push({dateOnly})
        }
        console.log({visitedData})
        res.status(200).json({
            error:false,
            success:true,
            message:"Successfull",
            data:visitedData
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


 








module.exports = {
    rep_registration, login, add_doctor, get_addedDoctors, leaveHistory, single_Details, delete_doctor, filter_dr, get_doctorDetail, delete_rep, report_expense,
    individual_expenseReport, add_drAddress, total_repCount, total_drCount, search_Rep, add_chemist, get_chemist, delete_chemist, search_chemist,
    edit_chemist, add_product, delete_product,editProduct, get_product, get_headquarters,travel_plan,get_travelPlan,notifications,searchByDate,search_expenseTable,
    markAsVisited,getVisitReport,singleChemistDetail,visitedDays
}