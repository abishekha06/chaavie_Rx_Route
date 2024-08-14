import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../../Util/Routes/routes_name.dart';
import '../../../../Util/Utils.dart';
import '../../../../View/homeView/Expense/widgets.dart';
import '../../../../View/homeView/home_view_rep.dart';
import '../../../../app_colors.dart';

class rep_expense extends StatefulWidget {
  const rep_expense({super.key});

  @override
  State<rep_expense> createState() => _rep_expenseState();
}

class _rep_expenseState extends State<rep_expense> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Widget> _tabs = [
    const Tab(text: 'Approved'),
    const Tab(text: 'Rejected'),
    const Tab(text: 'Pending'),
  ];

  final List<Widget> _pages = [
    ExpenseApprovalsWidgets.approved("${Utils.uniqueID}"),
    ExpenseApprovalsWidgets.rejected("${Utils.uniqueID}"),
    ExpenseApprovalsWidgets.pending("${Utils.uniqueID}"),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primaryColor,
        onPressed: (){
          Navigator.pushNamed(context, RoutesName.requestExpense);
        },
        child: Icon(Icons.add,color: AppColors.whiteColor,),
      ),
      body: SafeArea(
        child: Column(
          children: [
            TabBar(
              controller: _tabController,
              tabs: _tabs,
              labelColor: Colors.black,
              indicatorColor: Colors.green,
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: _pages,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

