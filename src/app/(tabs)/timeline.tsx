import { router } from 'expo-router';
import { useCheckIn } from '@/contexts/CheckInContext';
import { ProtectedScreen } from '@/components/protected-screen';
import { fetchTimelinePosts , createPost } from '@/services/timelineApi';
import type { Post } from '@/types/post';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View , Modal, TextInput } from 'react-native';
import { ActivityIndicator, Text, useTheme , FAB, Switch } from 'react-native-paper';

export default function TimelineScreen() {
  const theme = useTheme();
  const { currentCheckIn } = useCheckIn();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
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
      const response = await createPost({
        content: newContent.trim(),
        placeId: currentCheckIn.placeId,
        is_delayed_publish: isDelayedPublish,
      });
      setPosts((prev) => [response.post, ...prev]);
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
