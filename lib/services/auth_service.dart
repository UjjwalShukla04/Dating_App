import '../core/constants/api_constants.dart';
import 'api_service.dart';

class AuthService {
  AuthService({ApiService? apiService}) : _apiService = apiService ?? ApiService();

  final ApiService _apiService;

  Future<void> sendOtp(String phone) async {
    await _apiService.post(
      ApiConstants.sendOtpPath,
      <String, dynamic>{
        'phone': phone,
      },
    );
  }

  Future<String> verifyOtp(String phone, String otp) async {
    final data = await _apiService.post(
      ApiConstants.verifyOtpPath,
      <String, dynamic>{
        'phone': phone,
        'otp': otp,
      },
    );

    final token = data['token'] as String?;
    if (token == null || token.isEmpty) {
      throw ApiException('Missing token in response');
    }

    return token;
  }
}

