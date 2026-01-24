import '../core/constants/api_constants.dart';
import 'api_service.dart';

class AuthService {
  AuthService({ApiService? apiService})
    : _apiService = apiService ?? ApiService();

  final ApiService _apiService;

  Future<String?> sendOtp(String phone) async {
    final response = await _apiService.post(
      ApiConstants.sendOtpPath,
      <String, dynamic>{'phone': phone},
    );

    // In development, we return the OTP in the response for testing
    return response['otp']?.toString();
  }

  Future<String> verifyOtp(String phone, String otp) async {
    final response = await _apiService.post(
      ApiConstants.verifyOtpPath,
      <String, dynamic>{'phone': phone, 'otp': otp},
    );

    final data = response['data'] as Map<String, dynamic>?;
    final token = data?['token'] as String?;

    if (token == null || token.isEmpty) {
      throw ApiException('Missing token in response');
    }

    return token;
  }
}
