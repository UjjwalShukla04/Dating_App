import '../core/constants/api_constants.dart';
import 'api_service.dart';
import 'token_storage.dart';

class MessageService {
  MessageService({
    ApiService? apiService,
    TokenStorage? tokenStorage,
  })  : _apiService = apiService ?? ApiService(),
        _tokenStorage = tokenStorage ?? TokenStorage();

  final ApiService _apiService;
  final TokenStorage _tokenStorage;

  Future<List<dynamic>> getMessages(String matchId) async {
    final token = await _tokenStorage.getToken();
    if (token == null) {
      throw ApiException('Not authenticated');
    }

    final response = await _apiService.get(
      '${ApiConstants.messagesPath}/$matchId',
      token: token,
    );

    return response['data'] as List<dynamic>;
  }

  Future<Map<String, dynamic>> sendMessage(
    String matchId,
    String content,
  ) async {
    final token = await _tokenStorage.getToken();
    if (token == null) {
      throw ApiException('Not authenticated');
    }

    final response = await _apiService.post(
      '${ApiConstants.messagesPath}/$matchId',
      <String, dynamic>{'content': content},
      token: token,
    );

    return response['data'] as Map<String, dynamic>;
  }
}
