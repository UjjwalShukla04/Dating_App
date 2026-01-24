import 'package:flutter/material.dart';

import '../core/theme/app_theme.dart';
import 'app_router.dart';
import '../core/constants/route_paths.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IFeelO',
      theme: AppTheme.light,
      initialRoute: RoutePaths.splash,
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
