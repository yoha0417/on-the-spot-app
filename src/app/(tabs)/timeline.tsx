import { router } from 'expo-router';
import { useCheckIn } from '@/contexts/CheckInContext';
import { ProtectedScreen } from '@/components/protected-screen';
import { fetchTimelinePosts } from '@/services/timelineApi';
import type { Post } from '@/types/post';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export default function TimelineScreen() {
  const theme = useTheme();
  const { currentCheckIn } = useCheckIn();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToMap = useCallback(() => {
    Alert.alert(
      '警告',
      'チェックインしていません。マップ画面に戻ります。',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/map') }]
    );
  }, []);

  useEffect(() => {
    if (!currentCheckIn) {
      redirectToMap();
      return;
    }

    let cancelled = false;
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTimelinePosts(currentCheckIn.placeId);
        if (!cancelled) {
          setPosts(data.posts);
        }
      } catch (e) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : '投稿の取得に失敗しました';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [currentCheckIn, redirectToMap]);

  if (!currentCheckIn) {
    // リダイレクト中は何も表示しない（アラートが表示される）
    return null;
  }

  return (
    <ProtectedScreen>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {!loading && !error && (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text>まだ投稿がありません</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <Text variant="bodyMedium">{item.content}</Text>
                <Text variant="bodySmall" style={styles.postMeta}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postMeta: {
    color: '#888',
    marginTop: 8,
  },
});
