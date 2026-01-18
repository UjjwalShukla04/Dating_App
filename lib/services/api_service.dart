import 'dart:convert';

import 'package:http/http.dart' as http;

import '../core/constants/api_constants.dart';

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class ApiService {
  ApiService({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        _baseUrl = baseUrl ?? ApiConstants.baseUrl;

  final http.Client _client;
  final String _baseUrl;

  Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) async {
    final uri = Uri.parse('$_baseUrl$path');

    final response = await _client.post(
      uri,
      headers: const {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        'Request failed',
        statusCode: response.statusCode,
      );
    }

    if (response.body.isEmpty) {
      return <String, dynamic>{};
    }

    final decoded =
        jsonDecode(response.body) as Map<String, dynamic>? ?? <String, dynamic>{};

    final success = decoded['success'];
    if (success is bool && !success) {
      final message = decoded['message'] as String? ?? 'Request failed';
      throw ApiException(message, statusCode: response.statusCode);
    }

    final data = decoded.containsKey('data') && decoded['data'] is Map<String, dynamic>
        ? decoded['data'] as Map<String, dynamic>
        : decoded;

    return data;
  }
}

