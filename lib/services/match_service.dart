import '../core/constants/api_constants.dart';
import 'api_service.dart';
import 'token_storage.dart';

class MatchService {
  MatchService({
    ApiService? apiService,
    TokenStorage? tokenStorage,
  })  : _apiService = apiService ?? ApiService(),
        _tokenStorage = tokenStorage ?? TokenStorage();

  final ApiService _apiService;
  final TokenStorage _tokenStorage;

  Future<List<dynamic>> getMatches() async {
    final token = await _tokenStorage.getToken();
    if (token == null) {
      throw ApiException('Not authenticated');
    }

    final response = await _apiService.get(
      ApiConstants.matchesPath,
      token: token,
    );

    return response['data'] as List<dynamic>;
  }
}
