import 'package:file_picker/file_picker.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../View/homeView/Employee/add_rep.dart';
import '../../../app_colors.dart';
import '../../../constants/styles.dart';
import '../../../defaultButton.dart';
import '../../../widgets/customDropDown.dart';

class Adding_employee_mngr extends StatefulWidget {
  const Adding_employee_mngr({Key? key}) : super(key: key);

  @override
  State<Adding_employee_mngr> createState() => _Adding_employee_mngrState();
}

class _Adding_employee_mngrState extends State<Adding_employee_mngr> {

  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _qualificationController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();
  final TextEditingController _nationalityController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _designationController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _headQuaters = TextEditingController();
  final TextEditingController _reportingOfficer = TextEditingController();
  final TextEditingController _role = TextEditingController();
  final TextEditingController _reportingtype = TextEditingController();
  // final TextEditingController _confirmPasswordController = TextEditingController();

  String _gender = '';

  List<Officer> _officers = [];
  String? _selectedReportingOfficer;

  Headquarter? selectedHeadquarter;

  String? fileName;

  Future<void> pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      setState(() {
        fileName = result.files.single.name;
      });
    } else {
      // User canceled the picker
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(leading: IconButton(
        icon: CircleAvatar(backgroundColor: Colors.white,child: Icon(Icons.arrow_back_ios_rounded,color: AppColors.primaryColor,)), // Replace with your desired icon
        onPressed: () {
          // Handle the button press
          Navigator.pop(context);
        },
      ),centerTitle: true,title: Text('Add Employee',style: text40016black,),),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(mainAxisAlignment: MainAxisAlignment.start,crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 10,),
              Text('Basic Information ',style: text50014black,),
              SizedBox(height: 10,),
              Text('Name',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: TextFormField(
                  controller: _nameController,

                  decoration: InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(left: 10),
                      hintText: 'Name',
                      hintStyle: text50010tcolor2,
                      counterText: ''
                  ),
                ),
              ),
              SizedBox(height: 10,),
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Mobile',style: text50012black,),
                        SizedBox(height: 10,),
                        Container(
                          decoration: BoxDecoration(
                              color: AppColors.textfiedlColor,
                              borderRadius: BorderRadius.circular(6)
                          ),
                          child: TextFormField(
                            controller: _mobileController,
                            keyboardType: TextInputType.phone,
                            maxLength: 10,
                            decoration: InputDecoration(
                                contentPadding: EdgeInsets.only(left: 10),
                                border: InputBorder.none,
                                hintText: 'Mobile Number',
                                hintStyle: text50010tcolor2,
                                counterText: ''
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                  SizedBox(width: 10,),
                  Expanded(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Gender',style: text50012black,),
                        SizedBox(height: 10,),
                        Container(
                            decoration: BoxDecoration(
                                color: AppColors.textfiedlColor,
                                borderRadius: BorderRadius.circular(6)
                            ),
                            child: CustomDropdown(
                              options: ['Male','Female','Other'],
                              onChanged: (value) {
                                _gender = value.toString();
                              },
                            )
                        ),

                      ],
                    ),
                  ),

                ],
              ),

              SizedBox(height: 10,),
              Text('Qualification',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: TextFormField(
                  controller: _qualificationController,

                  decoration: InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(left: 10),
                      hintText: 'Qualification',
                      hintStyle: text50010tcolor2,
                      counterText: ''
                  ),
                ),
              ),
              SizedBox(height: 10,),
              Text('Email',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(left: 10),
                      hintText: 'Email',
                      hintStyle: text50010tcolor2,
                      counterText: ''
                  ),
                ),
              ),
              SizedBox(height: 10,),

              SizedBox(height: 10,),
              Text('Nationality',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: TextFormField(
                  controller: _nationalityController,

                  decoration: InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(left: 10),
                      hintText: 'Qualification',
                      hintStyle: text50010tcolor2,
                      counterText: ''
                  ),
                ),
              ),
              SizedBox(height: 10,),
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Date of birth',style: text50012black,),
                        SizedBox(height: 10,),
                        Container(
                          decoration: BoxDecoration(
                              color: AppColors.textfiedlColor,
                              borderRadius: BorderRadius.circular(6)
                          ),
                          child: TextFormField(
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 14,
                            ),
                            controller: _dobController,
                            decoration: InputDecoration(
                              hintText: 'Birth day',
                              hintStyle: text50010tcolor2,
                              isDense: true,
                              contentPadding: const EdgeInsets.fromLTRB(10, 10, 20, 0),
                              filled: true,
                              fillColor: Colors.grey.shade100,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide.none,
                              ),
                              suffixIcon: const Icon(
                                Icons.cake_outlined,
                                size: 25,
                                color: Colors.black,
                              ),
                            ),
                            readOnly: true,
                            onTap: () async {
                              DateTime currentDate = DateTime.now();
                              DateTime firstDate = DateTime(1900);
                              DateTime initialDate = DateTime(currentDate.year, currentDate.month - 1, currentDate.day - 1);
                              DateTime lastDate = currentDate; // Last day of the next month

                              DateTime? pickedDate = await showDatePicker(
                                context: context,
                                firstDate: firstDate,
                                initialDate: currentDate,
                                lastDate: lastDate,
                                builder: (BuildContext context, Widget? child) {
                                  return Theme(
                                    data: ThemeData.light().copyWith(
                                      primaryColor: AppColors.primaryColor,
                                      hintColor: AppColors.primaryColor,
                                      colorScheme: const ColorScheme.light(primary: AppColors.primaryColor),
                                      buttonTheme: const ButtonThemeData(textTheme: ButtonTextTheme.primary),
                                    ),
                                    child: child!,
                                  );
                                },
                              );

                              if (pickedDate != null) {
                                // Change the format of the date here
                                String formattedDate = DateFormat('dd-MM-yyyy').format(pickedDate);
                                setState(() {
                                  _dobController.text = formattedDate;
                                });
                              }
                            },
                            validator: (value) {
                              if(value! == null && value.isEmpty){
                                // Utils.flushBarErrorMessage('Select date first', context, lightColor);
                              }
                              return null;
                            },
                            // validator: (value) => value!.isEmpty ? 'Select Date' : null,
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(width: 10,),
                  Expanded(
                    flex: 3,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Designation',style: text50012black,),
                        SizedBox(height: 10,),
                        Container(
                          decoration: BoxDecoration(
                              color: AppColors.textfiedlColor,
                              borderRadius: BorderRadius.circular(6)
                          ),
                          child: TextFormField(
                            controller: _designationController,

                            decoration: InputDecoration(
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.only(left: 10),
                                hintText: 'Designation',
                                hintStyle: text50010tcolor2,
                                counterText: ''
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
              SizedBox(height: 10,),
              Text('HeadQuaters',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: CustomDropdown(
                  options: ['Male','Female','Other'],
                  onChanged: (value){
                    _headQuaters.text = value.toString();
                  },
                ),
              ),
              SizedBox(height: 10,),
              Text('Reporting officer',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: CustomDropdown(
                  options: ['Male','Female','Other'],
                  onChanged: (value){
                    _reportingOfficer.text = value.toString();
                  },
                ),
              ),
              SizedBox(height: 10,),
              Text('Role',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: CustomDropdown(
                  options: ['Male','Female','Other'],
                  onChanged: (value){
                    _role.text = value.toString();
                  },
                ),
              ),
              SizedBox(height: 10,),
              Text('Reporting type',style: text50012black,),
              SizedBox(height: 10,),
              Container(
                decoration: BoxDecoration(
                    color: AppColors.textfiedlColor,
                    borderRadius: BorderRadius.circular(6)
                ),
                child: CustomDropdown(
                  options: ['Male','Female','Other'],
                  onChanged: (value){
                    _reportingtype.text = value.toString();
                  },
                ),
              ),
              SizedBox(height: 10,),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Address',style: text50014black,),
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.textfiedlColor,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: TextFormField(
                      controller: _addressController,
                      maxLines: 3,
                      maxLength: 118,
                      decoration: InputDecoration(
                          contentPadding: EdgeInsets.only(left: 10),
                          border: InputBorder.none,
                          hintText: 'Address',
                          counterText: '',
                          hintStyle: text50010tcolor2
                      ),
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    InkWell(
                        onTap:pickFile,
                        child: Container(
                          width: MediaQuery.of(context).size.width/1.1,
                          decoration: BoxDecoration(
                              color: AppColors.textfiedlColor,
                              borderRadius: BorderRadius.circular(6)
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.file_present),
                                SizedBox(width: 10,),
                                Text('Add documents',style: text50012black,),
                                SizedBox(width: 10,),
                                fileName != null ? Icon(Icons.verified,color: AppColors.primaryColor,) : Icon(Icons.verified,color: Colors.grey,),
                              ],
                            ),
                          ),
                        )),
                  ],
                ),
              ),
              SizedBox(height: 10,),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  SizedBox(
                    width: MediaQuery.of(context).size.width / 2.5,
                    child: InkWell(
                      onTap: () {
                        if (_formKey.currentState!.validate()) {
                          // ScaffoldMessenger.of(context).showSnackBar(
                          //     const SnackBar(content: Text('Processing Data'))
                          // );
                          // adddoctors();
                        }
                      },
                      child: Defaultbutton(
                        text: 'Submit',
                        bgColor: AppColors.primaryColor,
                        textstyle: const TextStyle(
                          color: AppColors.whiteColor,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: (){
                      Navigator.pop(context);
                    },
                    child: SizedBox(
                      width: MediaQuery.of(context).size.width / 2.5,
                      child: Defaultbutton(
                        text: 'Cancel',
                        bgColor: AppColors.whiteColor,
                        bordervalues: Border.all(width: 1, color: AppColors.primaryColor),
                        textstyle: const TextStyle(
                          color: AppColors.primaryColor,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                ],
              )



            ],
          ),
        ),
      ),

    );
  }
}
