import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { useAuthStore } from '@store/authStore';
import { useFeedStore } from '@store/feedStore';
import { useRealtimePosts } from '@hooks/useRealtimePosts';
import { FontAwesome } from '@expo/vector-icons';
import { Post } from '@types/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FF4444',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  inputContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  postCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userName: {
    fontWeight: '600',
    color: '#000',
  },
  postTime: {
    color: '#999',
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function FeedScreen() {
  const { userId } = useAuthStore();
  const { posts, fetchPosts, createPost, toggleLike, isLoading, hasMore } = useFeedStore();
  useRealtimePosts();
  const [refreshing, setRefreshing] = useState(false);
  const [postText, setPostText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handlePost = async () => {
    if (!postText.trim() || !userId) return;

    setPosting(true);
    await createPost(userId, postText.trim());
    setPosting(false);
    setPostText('');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = Math.ceil(posts.length / 20) + 1;
      fetchPosts(nextPage);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.userName}>{item.user?.display_name || 'Anonymous'}</Text>
        <Text style={styles.postTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.postImage} />}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => userId && toggleLike(userId, item.id)}
        >
          <FontAwesome
            name={item.liked_by_me ? 'heart' : 'heart-o'}
            size={16}
            color={item.liked_by_me ? '#FF4444' : '#666'}
          />
          <Text style={styles.actionText}>{item.likes_count}</Text>
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <FontAwesome name="comment-o" size={16} color="#666" />
          <Text style={styles.actionText}>{item.comments_count}</Text>
        </View>
      </View>
    </View>
  );

  if (!userId) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF4444" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={postText}
          onChangeText={setPostText}
          editable={!posting}
          multiline
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePost}
          disabled={posting || !postText.trim()}
        >
          {posting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator color="#FF4444" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
