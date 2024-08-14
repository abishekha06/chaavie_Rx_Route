import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../../Util/Utils.dart';
import '../../../app_colors.dart';
import '../../../constants/styles.dart';
import '../../../res/app_url.dart';
class LeaveApprovalsWidgets{
  static final TextEditingController _searchController = TextEditingController();

  static List<dynamic> LeaveData = [];

  static Future<dynamic> getleaves(String userID) async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    String? uniqueid = preferences.getString('uniqueID');
    Utils.uniqueID = uniqueid;
    String url = AppUrl.get_leaves;
    Map<String, dynamic> data = {
      "uniqueRequesterId":uniqueid
    };

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(data),
      );
      print('body:${(data)}');
      print('st code :${response.statusCode}');
      print('st code :${response.body}');
      if (response.statusCode == 200) {
        var responseData = jsonDecode(response.body);
        print('resp data = ${responseData}');
        LeaveData.clear();
        LeaveData.addAll(responseData['data']);
        print('lv data ;:${LeaveData}');
        return responseData;
      } else {
        throw Exception('Failed to load data (status code: ${response.statusCode})');
      }
    } catch (e) {
      throw Exception('Failed to load data: $e');
    }
  }

  static Widget approved(String userID) {
    return FutureBuilder(
        future: getleaves(userID),
        builder: (context,snapshot) {
          if(snapshot.connectionState == ConnectionState.waiting){
            return Center(child: CircularProgressIndicator(),);
          }else if(snapshot.hasError){
            return Center(child: Text('Some error happened !'),);
          } else if(snapshot.hasData){
            return Padding(
              padding: const EdgeInsets.all(25.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                              border: Border.all(width: 0.5,color: AppColors.borderColor),
                              borderRadius: BorderRadius.circular(6)
                          ),
                          child: TextFormField(
                            decoration: const InputDecoration(
                              hintText: 'Search',
                              prefixIcon: Icon(Icons.search),
                              border: InputBorder.none,
                            ),
                            onChanged: (value){

                            },
                          ),
                        ),
                      ),
                      const SizedBox(width: 10,),
                      Container(
                        decoration: BoxDecoration(
                            color: AppColors.primaryColor,
                            borderRadius: BorderRadius.circular(6)
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: SizedBox(
                              height: 25,width: 25,
                              child: Image.asset('assets/icons/settings.png')),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10,),
                  Expanded(
                    child: ListView.builder(
                      shrinkWrap: true,
                        itemCount: snapshot.data!['data'].where((item)=>item['status'] == 'Accepted').toList().length,
                        itemBuilder: (context,index) {
                          var snapdata = snapshot.data!['data'].where((item)=>item['status'] == 'Accepted').toList();
                          int dayDiffrence = Utils.calculateDaysDifference(
                              snapdata[index]['from_date'],
                              snapdata[index]['to_date']
                          );
                          return  Padding(
                            padding: const EdgeInsets.only(top: 10.0,bottom: 10.0),
                            child: Stack(
                              children: [
                                Container(
                                  decoration:  BoxDecoration(
                                      color: AppColors.textfiedlColor,
                                    borderRadius: BorderRadius.circular(6)
                                  ),
                                  child: Column(
                                    children: [
                                      const SizedBox(height: 50,),
                                      Column(
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.only(top: 30.0,left: 10.0,right: 10.0,bottom: 20.0),
                                            child: Row(
                                              children: [
                                                Column(
                                                  children: [
                                                    Text('${snapdata[index]['from_date']}',style: text50014black,)
                                                    // Text('${snapdata[index]['from_date'].toString().substring(0,2)}'+'th'),
                                                    // Text('${Utils.formatMonth(snapdata[index]['from_date'].toString())}'),
                                                    // Text('(${Utils.formatDay(snapdata[index]['from_date']).toString().substring(0,3)})'),
                                                  ],
                                                ),
                                                const SizedBox(width: 20,),
                                                Container(
                                                  height: 20,
                                                  width: 20,
                                                  decoration: BoxDecoration(
                                                      borderRadius: BorderRadius.circular(50),
                                                      border: Border.all(width: 1,color: AppColors.blackColor)
                                                  ),),
                                                const Expanded(child: Divider(indent:10,color: AppColors.primaryColor,)),
                                                Padding(
                                                  padding: EdgeInsets.only(left: 10.0,right: 10.0),
                                                  child: Column(
                                                    children: [
                                                      Text('$dayDiffrence ${dayDiffrence == 1 ? 'day' : 'days' }',style:text50014black,),
                                                      // Text('10 Days available',style:text50010,),
                                                    ],
                                                  ),
                                                ),
                                                const Expanded(child: Divider(endIndent:10,color: AppColors.primaryColor,)),
                                                Container(
                                                  height: 20,
                                                  width: 20,
                                                  decoration: BoxDecoration(
                                                      color: AppColors.blackColor,
                                                      borderRadius: BorderRadius.circular(50),
                                                      border: Border.all(width: 5,color: Colors.grey)
                                                  ),),
                                                const SizedBox(width: 20,),
                                                Column(
                                                  children: [
                                                    Text('${snapdata[index]['to_date']}',style: text50014black,),
                                                    // Text('${snapdata[index]['to_date'].toString().substring(0,2)}'+'th'),
                                                    // Text('${Utils.formatMonth(snapdata[index]['to_date'].toString())}'),
                                                    // Text('(${Utils.formatDay(snapdata[index]['to_date']).toString().substring(0,3)})'),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          )
                                        ],
                                      ),
                                      const SizedBox(height: 10,),
                                      Padding(
                                        padding: EdgeInsets.only(left: 20.0),
                                        child: Text('${snapdata[index]['type']}',style: text50010black,),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.only(left: 10.0,right: 10,top: 10,bottom: 10),
                                        child: Container(
                                          width: MediaQuery.of(context).size.width,
                                          height: 100,
                                          decoration: BoxDecoration(
                                              color: AppColors.whiteColor,
                                              borderRadius: BorderRadius.circular(6)
                                          ),
                                          child: Padding(
                                            padding: EdgeInsets.all(10.0),
                                            child: Text('${snapdata[index]['remark']}'),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 50,)
                                    ],
                                  ),
                                ),
                                Positioned(
                                  top: 20,
                                  left: 20,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('${snapdata[index]['repDetails'][0]['name'].toString().toUpperCase()}',style: text50014black,),
                                      Text('${snapdata[index]['repDetails'][0]['designation'].toString().toUpperCase()}',style: text50010tcolor2,),
                                    ],
                                  ),
                                ),
                                Positioned(
                                  top: 20,
                                  right: 20,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(Utils.formatDate('${snapdata[index]['created_date'].toString()}'),style: text50014black,),
                                      SizedBox(height: 10,),
                                      Text('${snapdata[index]['status'].toString().toUpperCase()}',style: text40016,),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        }
                    ),
                  )
                ],
              ),
            );
          }else
            return Center(child: Text('Some error happened ! , please restart your application'),);
        }
    );
  }



  static Widget rejected(String ID) {
    return FutureBuilder(
        future: getleaves(ID),
        builder: (context,snapshot) {
          if(snapshot.connectionState == ConnectionState.waiting){
            return Center(child: CircularProgressIndicator(),);
          }else if(snapshot.hasError){
            return Center(child: Text('Some error happened !'),);
          }else if(snapshot.hasData){
            return Padding(
              padding: const EdgeInsets.all(25.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                              border: Border.all(width: 0.5,color: AppColors.borderColor),
                              borderRadius: BorderRadius.circular(6)
                          ),
                          child: TextFormField(
                            decoration: const InputDecoration(
                              hintText: 'Search',
                              prefixIcon: Icon(Icons.search),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10,),
                      Container(
                        decoration: BoxDecoration(
                            color: AppColors.primaryColor,
                            borderRadius: BorderRadius.circular(6)
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: SizedBox(
                              height: 25,width: 25,
                              child: Image.asset('assets/icons/settings.png')),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10,),
                  Expanded(
                    child: ListView.builder(
                        itemCount: snapshot.data!['data'].where((item)=>item['status'] == 'Rejected').toList().length,
                        itemBuilder: (context,index) {
                          var snapdata = snapshot.data!['data'].where((item)=>item['status'] == 'Rejected').toList();
                          int dayDiffrence = Utils.calculateDaysDifference(
                              snapdata[index]['from_date'],
                              snapdata[index]['to_date']
                          );
                          return  Padding(
                            padding: const EdgeInsets.only(top: 10.0,bottom: 10.0),
                            child: Stack(
                              children: [
                                Container(
                                  decoration:  BoxDecoration(
                                      color: AppColors.textfiedlColor,
                                    borderRadius: BorderRadius.circular(6)
                                  ),
                                  child: Column(
                                    children: [
                                      const SizedBox(height: 50,),
                                      Column(
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.only(top: 30.0,left: 10.0,right: 10.0,bottom: 20.0),
                                            child: Row(
                                              children: [
                                                Column(
                                                  children: [
                                                    Text('${snapdata[index]['from_date']}',style: text50014black,),
                                                    // Text('${snapdata[index]['from_date'].toString().substring(0,2)}'+'th'),
                                                    // Text('${Utils.formatMonth(snapdata[index]['from_date'].toString())}'),
                                                    // Text('(${Utils.formatDay(snapdata[index]['from_date']).toString().substring(0,3)})'),
                                                  ],
                                                ),
                                                const SizedBox(width: 20,),
                                                Container(
                                                  height: 20,
                                                  width: 20,
                                                  decoration: BoxDecoration(
                                                      borderRadius: BorderRadius.circular(50),
                                                      border: Border.all(width: 1,color: AppColors.blackColor)
                                                  ),),
                                                const Expanded(child: Divider(indent:10,color: AppColors.primaryColor,)),
                                                Padding(
                                                  padding: EdgeInsets.only(left: 10.0,right: 10.0),
                                                  child: Column(
                                                    children: [
                                                      Text('$dayDiffrence ${dayDiffrence == 1 ? 'day' : 'days' }',style:text50014black,),
                                                      // Text('10 Days available',style:text50010,),
                                                    ],
                                                  ),
                                                ),
                                                const Expanded(child: Divider(endIndent:10,color: AppColors.primaryColor,)),
                                                Container(
                                                  height: 20,
                                                  width: 20,
                                                  decoration: BoxDecoration(
                                                      color: AppColors.blackColor,
                                                      borderRadius: BorderRadius.circular(50),
                                                      border: Border.all(width: 5,color: Colors.grey)
                                                  ),),
                                                const SizedBox(width: 20,),
                                                Column(
                                                  children: [
                                                    Text('${snapdata[index]['to_date']}',style: text50014black,),
                                                    // Text('${snapdata[index]['to_date'].toString().substring(0,2)}'+'th'),
                                                    // Text('${Utils.formatMonth(snapdata[index]['to_date'].toString())}'),
                                                    // Text('(${Utils.formatDay(snapdata[index]['to_date']).toString().substring(0,3)})'),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          )
                                        ],
                                      ),
                                      const SizedBox(height: 10,),
                                      Padding(
                                        padding: EdgeInsets.only(left: 20.0),
                                        child: Text('${snapdata[index]['type']}',style: text50010black,),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.only(left: 10.0,right: 10,top: 10,bottom: 10),
                                        child: Container(
                                          width: MediaQuery.of(context).size.width,
                                          height: 100,
                                          decoration: BoxDecoration(
                                              color: AppColors.whiteColor,
                                              borderRadius: BorderRadius.circular(6)
                                          ),
                                          child: Padding(
                                            padding: EdgeInsets.all(10.0),
                                            child: Text('${snapdata[index]['remark']}'),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 50,)
                                    ],
                                  ),
                                ),
                                Positioned(
                                  top: 20,
                                  left: 20,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('${snapdata[index]['repDetails'][0]['name'].toString().toUpperCase()}',style: text50014black,),
                                      Text('${snapdata[index]['repDetails'][0]['designation'].toString().toUpperCase()}',style: text50010tcolor2,),
                                    ],
                                  ),
                                ),
                                Positioned(
                                  top: 20,
                                  right: 20,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(Utils.formatDate('${snapdata[index]['created_date'].toString()}'),style: text50014black,),
                                      SizedBox(height: 10,),
                                      Text('${snapdata[index]['status'].toString().toUpperCase()}',style: text40016red,),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        }
                    ),
                  )
                ],
              ),
            );
          }else
            return Center(child: Text('Some error happened ! , please restart your application'),);
        }
    );
  }

  static Widget pending(String ID) {
    return FutureBuilder(
      future: getleaves(ID),
      builder: (context,snapshot) {
        if(snapshot.connectionState == ConnectionState.waiting){
          return Center(child: CircularProgressIndicator(),);
        }else if(snapshot.hasError){
          return Center(child: Text('Some error happened !'),);
        }else if(snapshot.hasData){
          print('pending...${snapshot.data}');
          return Padding(
            padding: const EdgeInsets.all(25.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                            border: Border.all(width: 0.5,color: AppColors.borderColor),
                            borderRadius: BorderRadius.circular(6)
                        ),
                        child: TextFormField(
                          decoration: const InputDecoration(
                            hintText: 'Search',
                            prefixIcon: Icon(Icons.search),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10,),
                    Container(
                      decoration: BoxDecoration(
                          color: AppColors.primaryColor,
                          borderRadius: BorderRadius.circular(6)
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(10.0),
                        child: SizedBox(
                            height: 25,width: 25,
                            child: Image.asset('assets/icons/settings.png')),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10,),
                Expanded(
                  child: ListView.builder(
                      itemCount: snapshot.data!['data'].where((item)=>item['status'] == 'Pending').toList().length,
                      itemBuilder: (context,index) {
                        var snapdata = snapshot.data!['data'].where((item)=>item['status'] == 'Pending').toList();
                        int dayDiffrence = Utils.calculateDaysDifference(
                          snapdata[index]['from_date'],
                          snapdata[index]['to_date']
                        );
                        return  Padding(
                          padding: const EdgeInsets.only(top: 10.0,bottom: 10.0),
                          child: Stack(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                    color: AppColors.textfiedlColor,
                                  borderRadius: BorderRadius.circular(6)
                                ),
                                child: Column(
                                  children: [
                                    const SizedBox(height: 50,),
                                    Column(
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.only(top: 30.0,left: 10.0,right: 10.0,bottom: 20.0),
                                          child: Row(
                                            children: [
                                               Column(
                                                children: [
                                                  Text('${snapdata[index]['from_date'].toString()}',style: text50012black,),
                                                  // Text('${snapdata[index]['from_date'].toString().substring(0,2)}'+'th'),
                                                  // Text('${Utils.formatMonth(snapdata[index]['from_date'].toString())}'),
                                                  // Text('(${Utils.formatDay(snapdata[index]['from_date']).toString().substring(0,3)})'),
                                                ],
                                              ),
                                              const SizedBox(width: 20,),
                                              Container(
                                                height: 20,
                                                width: 20,
                                                decoration: BoxDecoration(
                                                    borderRadius: BorderRadius.circular(50),
                                                    border: Border.all(width: 1,color: AppColors.blackColor)
                                                ),),
                                              const Expanded(child: Divider(indent:10,color: AppColors.primaryColor,)),
                                               Padding(
                                                padding: EdgeInsets.only(left: 10.0,right: 10.0),
                                                child: Column(
                                                  children: [
                                                    Text('$dayDiffrence ${dayDiffrence == 1 ? 'day' : 'days' }',style:text50014black,),
                                                    // Text('10 Days available',style:text50010,),
                                                  ],
                                                ),
                                              ),
                                              const Expanded(child: Divider(endIndent:10,color: AppColors.primaryColor,)),
                                              Container(
                                                height: 20,
                                                width: 20,
                                                decoration: BoxDecoration(
                                                    color: AppColors.blackColor,
                                                    borderRadius: BorderRadius.circular(50),
                                                    border: Border.all(width: 5,color: Colors.grey)
                                                ),),
                                              const SizedBox(width: 20,),
                                               Column(
                                                children: [
                                                  Text('${snapdata[index]['to_date'].toString()}',style: TextStyle(
                                                      color: Colors.black45,
                                                      fontWeight: FontWeight.w400,
                                                      fontSize: 16
                                                  )),
                                                  // Text('${snapdata[index]['to_date'].toString().substring(0,2)}'+'th'),
                                                  // Text('${Utils.formatMonth(snapdata[index]['to_date'].toString())}'),
                                                  // Text('(${Utils.formatDay(snapdata[index]['to_date']).toString().substring(0,3)})'),
                                                ],
                                              ),
                                            ],
                                          ),
                                        )
                                      ],
                                    ),
                                    const SizedBox(height: 10,),
                                     Padding(
                                      padding: EdgeInsets.only(left: 20.0),
                                      child: Text('${snapdata[index]['type']}',style: text50010black,),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.only(left: 10.0,right: 10,top: 10,bottom: 10),
                                      child: Container(
                                        width: MediaQuery.of(context).size.width,
                                        height: 100,
                                        decoration: BoxDecoration(
                                            color: AppColors.whiteColor,
                                            borderRadius: BorderRadius.circular(6)
                                        ),
                                        child: Padding(
                                          padding: EdgeInsets.all(10.0),
                                          child: Text('${snapdata[index]['remark']}'),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 50,)
                                  ],
                                ),
                              ),
                              Positioned(
                                top: 20,
                                left: 20,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('${snapdata[index]['repDetails'][0]['name'].toString().toUpperCase()}',style: text50014black,),
                                    Text('${snapdata[index]['repDetails'][0]['designation'].toString().toUpperCase()}',style: text50010tcolor2,),
                                  ],
                                ),
                              ),
                               Positioned(
                                top: 20,
                                right: 20,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(Utils.formatDate('${snapdata[index]['created_date'].toString()}'),style: text50014black,),
                                    SizedBox(height: 10,),
                                    Text('${snapdata[index]['status'].toString().toUpperCase()}',style: TextStyle(color: Colors.black45),),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      }
                  ),
                )
              ],
            ),
          );
        }else
        return Center(child: Text('Some error happened ! , please restart your application'),);
      }
    );
  }
}

