import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class RepHomepage extends StatefulWidget {
  const RepHomepage({super.key});

  @override
  State<RepHomepage> createState() => _RepHomepageState();
}

class _RepHomepageState extends State<RepHomepage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Rep Homepage'),),

    );
  }
}
