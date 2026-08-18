import { ProtectedScreen } from '@/components/protected-screen';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserPosts } from '@/services/timelineApi';
import type { Post } from '@/types/post';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Text, useTheme } from 'react-native-paper';

function formatStayDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${remainingMinutes}分`;
}

export default function AccountScreen() {
  const theme = useTheme();
  const { userName, userId } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadInitialPosts = async () => {
      try {
        const data = await fetchUserPosts(userId);
        if (!cancelled) {
          setPosts(data.posts);
          setError(null);
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

    loadInitialPosts();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleRefresh = useCallback(async () => {
    if (!userId) return;

    setRefreshing(true);
    try {
      const data = await fetchUserPosts(userId);
      setPosts(data.posts);
    } catch (e) {
      const message = e instanceof Error ? e.message : '投稿の更新に失敗しました';
      Alert.alert('エラー', message);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  return (
    <ProtectedScreen>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Avatar.Text size={64} label={(userName ?? '?').charAt(0)} />
          <Text variant="headlineSmall" style={styles.userName}>
            {userName ?? '不明'}
          </Text>
        </View>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text>まだ投稿がありません</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Avatar.Text size={40} label={(item.userName ?? '?').charAt(0)} />
                  <View style={styles.postHeaderInfo}>
                    <Text variant="labelLarge" style={styles.userName}>
                      {item.userName ?? '不明'}
                    </Text>
                    <Text variant="bodySmall" style={styles.stayDuration}>
                      滞在時間: {formatStayDuration(item.stayDurationMinutes)}
                    </Text>
                  </View>
                </View>

                <Text variant="bodyMedium" style={styles.postContent}>
                  {item.content}
                </Text>

                <View style={styles.postFooter}>
                  <Text variant="bodySmall" style={styles.postMeta}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                  <Text variant="bodySmall" style={styles.postMeta}>
                    ❤️ {item.likesCount}
                  </Text>
                </View>
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
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  userName: {
    marginTop: 8,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  stayDuration: {
    color: '#666',
    marginTop: 2,
  },
  postContent: {
    marginBottom: 8,
    lineHeight: 22,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  postMeta: {
    color: '#aaa',
    marginTop: 4,
  },
});
