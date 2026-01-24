import '../core/constants/api_constants.dart';
import 'api_service.dart';
import 'token_storage.dart';

class SwipeService {
  SwipeService({
    ApiService? apiService,
    TokenStorage? tokenStorage,
  })  : _apiService = apiService ?? ApiService(),
        _tokenStorage = tokenStorage ?? TokenStorage();

  final ApiService _apiService;
  final TokenStorage _tokenStorage;

  Future<List<dynamic>> getDiscoverProfiles() async {
    final token = await _tokenStorage.getToken();
    if (token == null) {
      throw ApiException('Not authenticated');
    }

    final response = await _apiService.get(
      ApiConstants.discoverPath,
      token: token,
    );

    return response['data'] as List<dynamic>;
  }

  Future<Map<String, dynamic>> swipeProfile({
    required String toUserId,
    required String action,
  }) async {
    final token = await _tokenStorage.getToken();
    if (token == null) {
      throw ApiException('Not authenticated');
    }

    final response = await _apiService.post(
      ApiConstants.swipePath,
      <String, dynamic>{
        'toUserId': toUserId,
        'action': action,
      },
      token: token,
    );

    return response['data'] as Map<String, dynamic>;
  }
}
