import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';

import 'package:shared_preferences/shared_preferences.dart';

import '../New Rx Project/Manager/Login page.dart';
import '../Util/Utils.dart';
import '../View/authView/loginView.dart';
import '../View/homeView/home_view.dart';
import '../View/homeView/home_view_rep.dart';
import '../app_colors.dart';
import '../constants/styles.dart';
import '../widgets/bubble.dart';
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initPackageInfo();
    _navigateToHome();
  }

  Future<void> _initPackageInfo() async {
    final info = await PackageInfo.fromPlatform();
    setState(() {
      Utils.appversion = info.version;
    });
  }


  _navigateToHome() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    String? uniqueID = preferences.getString('uniqueID');
    String? userType = preferences.getString('userType');
    print('userType:$userType');
    print('objectddd$preferences');
    if(uniqueID != null){
      if(userType == 'rep'){
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomeViewRep()),
        );
      }else if(userType == 'manager'){
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomeView()),
        );
      }
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => LoginPageNew(),));
    }else{
      await Future.delayed(const Duration(seconds: 3), () {});
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPageNew()),
      );
    }

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryColor,
      floatingActionButton: Text('${Utils.appversion}',style: text70014,),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      body: const Stack(
        children: [
          Positioned(
            top: -82,
            left: -87,
            child: Bubble(
              size: 246,
              color: AppColors.primaryColor2,
            ),
          ),

          Positioned(
            top: 67,
            left: 151,
            child: Bubble(
              size: 130,
              color: AppColors.primaryColor2,
            ),
          ),

          Positioned(
            top: 164,
            left: 66,
            child: Bubble(
              size: 75,
              color: AppColors.primaryColor2,
            ),
          ),

          // Bottom bubbles
          Positioned(
            bottom: -82,
            right: -87,
            child: Bubble(
              size: 246,
              color: AppColors.primaryColor2,
            ),
          ),
          Positioned(
            bottom: 67,
            right: 151,
            child: Bubble(
              size: 130,
              color: AppColors.primaryColor2,
            ),
          ),
          Positioned(
            bottom: 164,
            right: 66,
            child: Bubble(
              size: 75,
              color: AppColors.primaryColor2,
            ),
          ),
          Center(
            child: Text(
              'RXROUTE',
              style: TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                fontStyle: FontStyle.italic
              ),
            ),
          ),

        ],
      ),
    );
  }
}
