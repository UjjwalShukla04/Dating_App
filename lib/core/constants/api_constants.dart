import 'package:flutter/foundation.dart';

class ApiConstants {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:4000';
    }

    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return 'http://10.0.2.2:4000';
      default:
        return 'http://localhost:4000';
    }
  }

  static const String sendOtpPath = '/auth/send-otp';
  static const String verifyOtpPath = '/auth/verify-otp';
}
