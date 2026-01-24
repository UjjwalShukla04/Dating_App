import 'package:flutter/material.dart';
import '../../../core/constants/route_paths.dart';
import '../../../services/swipe_service.dart';

class SwipeScreen extends StatefulWidget {
  const SwipeScreen({super.key});

  @override
  State<SwipeScreen> createState() => _SwipeScreenState();
}

class _SwipeScreenState extends State<SwipeScreen> {
  final SwipeService _swipeService = SwipeService();
  List<dynamic> _profiles = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadProfiles();
  }

  Future<void> _loadProfiles() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });
      final profiles = await _swipeService.getDiscoverProfiles();
      setState(() {
        _profiles = profiles;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _swipe(String action) async {
    if (_profiles.isEmpty) return;

    final profile = _profiles.first;
    // Try to find the user ID in various fields
    final toUserId = profile['userId'] ?? profile['user_id'] ?? profile['id'];

    print('Swiping profile: $profile');
    print('toUserId resolved to: $toUserId');

    // Optimistic update
    setState(() {
      _profiles.removeAt(0);
    });

    try {
      final result = await _swipeService.swipeProfile(
        toUserId: toUserId,
        action: action,
      );

      if (result['match'] != null) {
        _showMatchDialog(profile, result['match']);
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Swipe failed: $e')));
      // Revert optimistic update (optional, but complex to add back at correct spot)
      // For MVP, just reload
      _loadProfiles();
    }
  }

  void _showMatchDialog(dynamic profile, dynamic match) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("It's a Match! 🎉"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (profile['photoUrl'] != null)
              CircleAvatar(
                radius: 40,
                backgroundImage: NetworkImage(profile['photoUrl']),
              ),
            const SizedBox(height: 16),
            Text("You and ${profile['fullName']} liked each other!"),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Keep Swiping'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pushNamed(
                context,
                RoutePaths.chat,
                arguments: {
                  'matchId': match['id'],
                  'otherUserName': profile['fullName'],
                  'otherUserPhotoUrl': profile['photoUrl'],
                },
              );
            },
            child: const Text('Say Hello'),
          ),
        ],
      ),
    );
  }

  Future<void> _resetSwipes() async {
    try {
      setState(() {
        _isLoading = true;
      });
      await _swipeService.resetSwipes();
      await _loadProfiles();
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = e.toString();
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
            ElevatedButton(
              onPressed: _loadProfiles,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_profiles.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'No more profiles to discover.\nCheck back later!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _resetSwipes,
              icon: const Icon(Icons.refresh),
              label: const Text('Reset Swipes (Dev Only)'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber.shade100,
                foregroundColor: Colors.brown,
              ),
            ),
          ],
        ),
      );
    }

    final profile = _profiles.first;

    return Column(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(16),
                        ),
                        image: profile['photoUrl'] != null
                            ? DecorationImage(
                                image: NetworkImage(profile['photoUrl']),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: profile['photoUrl'] == null
                          ? const Center(
                              child: Icon(
                                Icons.person,
                                size: 100,
                                color: Colors.white,
                              ),
                            )
                          : null,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${profile['fullName']}, ${calculateAge(profile['dateOfBirth'] ?? profile['dob'])}',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          profile['bio'] ?? 'No bio available',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              FloatingActionButton(
                heroTag: 'dislike',
                onPressed: () => _swipe('dislike'),
                backgroundColor: Colors.white,
                foregroundColor: Colors.red,
                child: const Icon(Icons.close, size: 32),
              ),
              const SizedBox(width: 32),
              FloatingActionButton(
                heroTag: 'like',
                onPressed: () => _swipe('like'),
                backgroundColor: Colors.pink,
                foregroundColor: Colors.white,
                child: const Icon(Icons.favorite, size: 32),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String calculateAge(String? dobString) {
    if (dobString == null) return '';
    try {
      final dob = DateTime.parse(dobString);
      final now = DateTime.now();
      int age = now.year - dob.year;
      if (now.month < dob.month ||
          (now.month == dob.month && now.day < dob.day)) {
        age--;
      }
      return age.toString();
    } catch (e) {
      return '';
    }
  }
}
