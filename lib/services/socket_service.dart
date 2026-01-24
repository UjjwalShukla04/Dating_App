import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:logging/logging.dart';
import '../core/constants/api_constants.dart';
import 'token_storage.dart';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? _socket;
  final TokenStorage _tokenStorage = TokenStorage();
  final _logger = Logger('SocketService');

  bool get isConnected => _socket?.connected ?? false;

  Future<void> connect() async {
    if (isConnected) return;

    final token = await _tokenStorage.getToken();
    if (token == null) {
      _logger.warning('No token found, cannot connect to socket');
      return;
    }

    _logger.info('Connecting to socket at ${ApiConstants.baseUrl}...');

    _socket = IO.io(
      ApiConstants.baseUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );

    _socket?.connect();

    _socket?.onConnect((_) {
      _logger.info('Connected to socket: ${_socket?.id}');
    });

    _socket?.onConnectError((data) {
      _logger.severe('Connect error: $data');
    });

    _socket?.onError((data) {
      _logger.severe('Socket error: $data');
    });

    _socket?.onDisconnect((_) {
      _logger.info('Disconnected from socket');
    });
  }

  void joinRoom(String matchId) {
    if (isConnected) {
      _logger.info('Joining room: $matchId');
      _socket?.emit('join_room', {'matchId': matchId});
    } else {
      _logger.warning('Socket not connected, cannot join room');
      // Attempt to connect and then join?
      connect().then((_) {
        if (isConnected) {
             _socket?.emit('join_room', {'matchId': matchId});
        }
      });
    }
  }

  void sendMessage(String matchId, String content) {
    if (isConnected) {
      _socket?.emit('send_message', {'matchId': matchId, 'content': content});
    } else {
      _logger.warning('Socket not connected, cannot send message');
      throw Exception('Socket not connected');
    }
  }

  void onMessage(Function(dynamic) callback) {
    _socket?.on('receive_message', callback);
  }

  void offMessage() {
    _socket?.off('receive_message');
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }
}
