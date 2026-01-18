import 'package:flutter/material.dart';

import '../../../core/constants/route_paths.dart';
import '../../../services/auth_service.dart';
import '../../../services/token_storage.dart';

class OtpScreen extends StatefulWidget {
  const OtpScreen({super.key, required this.phone});

  final String phone;

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final TextEditingController _otpController = TextEditingController();
  final AuthService _authService = AuthService();
  final TokenStorage _tokenStorage = TokenStorage();

  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _onVerifyOtp() async {
    final otp = _otpController.text.trim();

    if (otp.isEmpty) {
      setState(() {
        _error = 'Please enter OTP';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final token = await _authService.verifyOtp(widget.phone, otp);

      await _tokenStorage.saveToken(token);

      if (!mounted) {
        return;
      }

      Navigator.of(context).pushReplacementNamed(RoutePaths.home);
    } catch (_) {
      setState(() {
        _error = 'Failed to verify OTP';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Enter OTP')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _otpController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'OTP'),
            ),
            const SizedBox(height: 16),
            if (_error != null) ...[
              Text(
                _error!,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
              const SizedBox(height: 16),
            ],
            ElevatedButton(
              onPressed: _isLoading ? null : _onVerifyOtp,
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Verify OTP'),
            ),
          ],
        ),
      ),
    );
  }
}
