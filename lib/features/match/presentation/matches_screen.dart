import 'package:flutter/material.dart';
import '../../../services/match_service.dart';
import '../../../core/constants/route_paths.dart';

class MatchesScreen extends StatefulWidget {
  const MatchesScreen({super.key});

  @override
  State<MatchesScreen> createState() => _MatchesScreenState();
}

class _MatchesScreenState extends State<MatchesScreen> {
  final MatchService _matchService = MatchService();
  List<dynamic> _matches = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadMatches();
  }

  Future<void> _loadMatches() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });
      final matches = await _matchService.getMatches();
      setState(() {
        _matches = matches;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Error: $_error'),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _loadMatches, child: const Text('Retry')),
          ],
        ),
      );
    }

    if (_matches.isEmpty) {
      return const Center(child: Text('No matches yet.\nStart swiping!'));
    }

    return ListView.builder(
      itemCount: _matches.length,
      itemBuilder: (context, index) {
        final match = _matches[index];
        final profile = match['profile'];
        return ListTile(
          leading: const CircleAvatar(child: Icon(Icons.person)),
          title: Text(profile['fullName'] ?? 'Unknown'),
          subtitle: Text(
            'Matched on ${match['matchedAt']?.toString().split(' ')[0]}',
          ),
          onTap: () {
            Navigator.of(context).pushNamed(
              RoutePaths.chat,
              arguments: {
                'matchId': match['id'],
                'otherUserName': profile['fullName'] ?? 'Unknown',
                'otherUserPhotoUrl': null, // Add photo URL if available
              },
            );
          },
        );
      },
    );
  }
}
