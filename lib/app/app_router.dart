import 'package:flutter/material.dart';

import '../core/constants/route_paths.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/otp_screen.dart';
import '../features/home/presentation/home_screen.dart';

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RoutePaths.login:
        return MaterialPageRoute<void>(builder: (_) => const LoginScreen());
      case RoutePaths.otp:
        final phone = settings.arguments as String?;
        return MaterialPageRoute<void>(
          builder: (_) => OtpScreen(phone: phone ?? ''),
        );
      case RoutePaths.home:
        return MaterialPageRoute<void>(builder: (_) => const HomeScreen());
      default:
        return MaterialPageRoute<void>(builder: (_) => const LoginScreen());
    }
  }
}
