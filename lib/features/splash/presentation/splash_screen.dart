import 'package:flutter/material.dart';
import '../../../core/constants/route_paths.dart';
import '../../../services/token_storage.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final TokenStorage _tokenStorage = TokenStorage();

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    // Artificial delay for splash effect
    await Future.delayed(const Duration(seconds: 1));

    final token = await _tokenStorage.getToken();

    if (!mounted) return;

    if (token != null && token.isNotEmpty) {
      // Assuming if token exists, user is logged in. 
      // Ideally we should validate token or check profile status here.
      // For MVP, we go to Home (or ProfileSetup if we want to be safe, but Home is better UX for returning users)
      // Since we don't have a "isProfileComplete" flag in storage, we might risk going to Home without profile.
      // But let's assume they completed it.
      Navigator.of(context).pushReplacementNamed(RoutePaths.home);
    } else {
      Navigator.of(context).pushReplacementNamed(RoutePaths.login);
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.favorite, size: 80, color: Colors.pink),
            SizedBox(height: 16),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
