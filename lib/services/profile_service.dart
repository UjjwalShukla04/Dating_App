import '../core/constants/api_constants.dart';
import 'api_service.dart';
import 'token_storage.dart';

class ProfileService {
  ProfileService({
    ApiService? apiService,
    TokenStorage? tokenStorage,
  })  : _apiService = apiService ?? ApiService(),
        _tokenStorage = tokenStorage ?? TokenStorage();

  final ApiService _apiService;
  final TokenStorage _tokenStorage;

  Future<void> saveProfile({
    required String fullName,
    required String gender,
    required DateTime dob,
    required String bio,
  }) async {
    final token = await _tokenStorage.getToken();
    if (token == null) {
      throw ApiException('Not authenticated');
    }

    await _apiService.post(
      ApiConstants.profilePath,
      <String, dynamic>{
        'fullName': fullName,
        'gender': gender,
        'dob': dob.toIso8601String(),
        'bio': bio,
      },
      token: token,
    );
  }
}
