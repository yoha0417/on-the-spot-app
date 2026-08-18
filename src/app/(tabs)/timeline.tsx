import { router } from 'expo-router';
import { useCheckIn } from '@/contexts/CheckInContext';
import { ProtectedScreen } from '@/components/protected-screen';
import { fetchTimelinePosts, createPost, toggleLike } from '@/services/timelineApi';
import type { Post } from '@/types/post';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View, Modal, TextInput } from 'react-native';
import { ActivityIndicator, Avatar, Button, Text, useTheme, FAB, Switch } from 'react-native-paper';

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

export default function TimelineScreen() {
  const theme = useTheme();
  const { currentCheckIn } = useCheckIn();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [isDelayedPublish, setIsDelayedPublish] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectToMap = useCallback(() => {
    Alert.alert(
      '警告',
      'チェックインしていません。マップ画面に戻ります。',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/map') }]
    );
  }, []);

  const handleCreatePost = useCallback(async () => {
    if (!currentCheckIn || !newContent.trim()) return;
    setSubmitting(true);
    try {
      await createPost({
        content: newContent.trim(),
        placeId: currentCheckIn.placeId,
        is_delayed_publish: isDelayedPublish,
      });
      const data = await fetchTimelinePosts(currentCheckIn.placeId);
      setPosts(data.posts);
      setNewContent('');
      setIsDelayedPublish(false);
      setModalVisible(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : '投稿に失敗しました';
      Alert.alert('エラー', message);
    } finally {
      setSubmitting(false);
    }
  }, [currentCheckIn, newContent, isDelayedPublish]);

  const handleToggleLike = useCallback(async (postId: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    const wasLiked = originalPost.isLiked;
    const originalLikesCount = originalPost.likesCount;

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        isLiked: !wasLiked,
        likesCount: wasLiked ? originalLikesCount - 1 : originalLikesCount + 1,
      };
    }));

    try {
      const result = await toggleLike(postId);
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          likesCount: result.likesCount,
        };
      }));
    } catch (e) {
      // Rollback on failure
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          isLiked: wasLiked,
          likesCount: originalLikesCount,
        };
      }));
      const message = e instanceof Error ? e.message : 'いいねに失敗しました';
      Alert.alert('エラー', message);
    }
  }, [posts]);

  const handleRefresh = useCallback(async () => {
    if (!currentCheckIn) return;
    setRefreshing(true);
    try {
      const data = await fetchTimelinePosts(currentCheckIn.placeId);
      setPosts(data.posts);
    } catch (e) {
      const message = e instanceof Error ? e.message : '投稿の更新に失敗しました';
      Alert.alert('エラー', message);
    } finally {
      setRefreshing(false);
    }
  }, [currentCheckIn]);

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
                    <Text variant="labelLarge" style={styles.userName}>{item.userName ?? '不明'}</Text>
                    <Text variant="bodySmall" style={styles.stayDuration}>
                      滞在時間: {formatStayDuration(item.stayDurationMinutes)}
                    </Text>
                  </View>
                </View>
                <Text variant="bodyMedium" style={styles.postContent}>{item.content}</Text>
                <View style={styles.postFooter}>
                  <Text variant="bodySmall" style={styles.postMeta}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                  <Button
                    mode="text"
                    icon={item.isLiked ? 'heart' : 'heart-outline'}
                    textColor={item.isLiked ? '#e0245e' : '#aaa'}
                    onPress={() => handleToggleLike(item.id)}
                    compact
                  >
                    {item.likesCount > 0 ? item.likesCount : ''}
                  </Button>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        visible={!modalVisible}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text variant="headlineSmall" style={styles.modalTitle}>
            新規投稿
          </Text>

          <TextInput
            style={styles.textInput}
            placeholder="いまどうしてる？"
            value={newContent}
            onChangeText={setNewContent}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.switchRow}>
            <Text>遅延公開</Text>
            <Switch
              value={isDelayedPublish}
              onValueChange={setIsDelayedPublish}
            />
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              disabled={submitting}
            >
              キャンセル
            </Button>
            <Button
              mode="contained"
              onPress={handleCreatePost}
              loading={submitting}
              disabled={submitting || !newContent.trim()}
            >
              投稿する
            </Button>
          </View>
        </View>
      </Modal>
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
  userName: {
    fontWeight: '600',
  },
  stayDuration: {
    color: '#666',
    marginTop: 2,
  },
  postContent: {
    marginBottom: 8,
    lineHeight: 22,
  },
  postMeta: {
    color: '#aaa',
    marginTop: 4,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
