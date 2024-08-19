import 'package:flutter/cupertino.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';

import '../../Util/Utils.dart';
import '../../View/profile/settings/terms_and_conditions.dart';
import '../../app_colors.dart';
import '../../constants/styles.dart';
import 'BottomNav/BottomNavManager.dart';
import 'BottomNav/HomepageManagerNew.dart';

class LoginPageNew extends StatefulWidget {
  const LoginPageNew({Key? key}) : super(key: key);

  @override
  State<LoginPageNew> createState() => _LoginPageNewState();
}

class _LoginPageNewState extends State<LoginPageNew> {

  final _formKey = GlobalKey<FormState>();
  bool _passwordVisible = false;

  final TextEditingController userid = TextEditingController();
  final TextEditingController password = TextEditingController();

  final FocusNode useridNode = FocusNode();
  final FocusNode passwordNode = FocusNode();


  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('User Login',style: text70014black,),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('User ID Gikhin',style: text50012black,),
                    SizedBox(height: 10,),
                    Container(
                      decoration: BoxDecoration(
                          color: AppColors.textfiedlColor,
                          borderRadius: BorderRadius.circular(6)
                      ),
                      child: TextFormField(
                        controller: userid,
                        focusNode: useridNode,
                        onFieldSubmitted: (value){
                          Utils.fieldFocusChange(context, useridNode, passwordNode);
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please fill this field';
                          }
                          return null;
                        },

                        decoration: InputDecoration(
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.only(left: 10),
                            // hintText: 'User id',
                            hintStyle: text50010tcolor2,
                            counterText: ''
                        ),
                      ),
                    ),
                    SizedBox(height: 10,),

                    Text('Password',style: text50012black,),
                    SizedBox(height: 10,),
                    Container(
                      decoration: BoxDecoration(
                          color: AppColors.textfiedlColor,
                          borderRadius: BorderRadius.circular(6)
                      ),
                      child: TextFormField(
                        controller: password,
                        focusNode: passwordNode,
                        onFieldSubmitted: (value){
                          Utils.fieldFocusChange(context, passwordNode, passwordNode);
                        },
                        obscureText: !_passwordVisible,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please fill this field';
                          }
                          return null;
                        },
                        decoration: InputDecoration(
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.only(left: 10),

                            hintStyle: text50010tcolor2,
                          suffixIcon: IconButton(
                            icon: Icon(
                              _passwordVisible
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                            ),
                            onPressed: () {
                              setState(() {
                                _passwordVisible = !_passwordVisible;
                              });
                            },
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 10,),
                    Row(mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(

                            children: [
                              TextSpan(
                                text: 'Forgot Password',
                                style: const TextStyle(
                                  color: Colors.blue,
                                  decoration: TextDecoration.underline,
                                ),
                                recognizer: TapGestureRecognizer()
                                  ..onTap = () {
                                    // Handle Terms & Conditions click
                                    print('Terms & Conditions clicked');
                                    Navigator.push(context, MaterialPageRoute(builder: (context) => TermsAndConditions()));
                                  },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 10,),
                    Center(
                      child: InkWell(
                        onTap: () {
                          // if (_formKey.currentState!.validate()) {
                          //   setState(() {
                          //     // login();
                          //   });
                          // }
                          Navigator.push(context, MaterialPageRoute(builder: (context) => BottomNavigationMngr(),));
                        },
                        child: Container(

                          decoration: BoxDecoration(
                            color: AppColors.primaryColor,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Center(
                              child: Text(
                                'Login',
                                style: TextStyle(
                                  color: AppColors.whiteColor,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),

                  ],
                ),
              ),

            ],
          ),
        ),
      ),
    );
  }
}
