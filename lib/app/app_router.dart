import 'package:flutter/material.dart';

import '../core/constants/route_paths.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/otp_screen.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/profile/presentation/profile_setup_screen.dart';
import '../features/splash/presentation/splash_screen.dart';
import '../features/chat/presentation/chat_screen.dart';

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case RoutePaths.splash:
        return MaterialPageRoute<void>(builder: (_) => const SplashScreen());
      case RoutePaths.login:
        return MaterialPageRoute<void>(builder: (_) => const LoginScreen());
      case RoutePaths.otp:
        final args = settings.arguments;
        String phone = '';
        String? otp;

        if (args is String) {
          phone = args;
        } else if (args is Map<String, dynamic>) {
          phone = args['phone'] as String? ?? '';
          otp = args['otp'] as String?;
        }

        return MaterialPageRoute<void>(
          builder: (_) => OtpScreen(phone: phone, otp: otp),
        );
      case RoutePaths.profileSetup:
        return MaterialPageRoute<void>(
          builder: (_) => const ProfileSetupScreen(),
        );
      case RoutePaths.home:
        return MaterialPageRoute<void>(builder: (_) => const HomeScreen());
      case RoutePaths.chat:
        final args = settings.arguments as Map<String, dynamic>;
        return MaterialPageRoute<void>(
          builder: (_) => ChatScreen(
            matchId: args['matchId'],
            otherUserName: args['otherUserName'],
            otherUserPhotoUrl: args['otherUserPhotoUrl'],
          ),
        );
      default:
        return MaterialPageRoute<void>(builder: (_) => const LoginScreen());
    }
  }
}
