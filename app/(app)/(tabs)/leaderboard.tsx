import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useAuthStore } from '@store/authStore';
import { useGamificationStore } from '@store/gamificationStore';
import { FontAwesome } from '@expo/vector-icons';
import { Leaderboard } from '@types/index';

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
  userStatsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    margin: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  userStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  userStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  userStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4444',
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  userLevel: {
    fontSize: 12,
    color: '#999',
  },
  userPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function LeaderboardScreen() {
  const { userId } = useAuthStore();
  const { leaderboard, userRank, userPoints, userLevel, fetchLeaderboard, isLoading } =
    useGamificationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboard(50, 0);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard(50, 0);
    setRefreshing(false);
  };

  const renderLeaderboardItem = ({ item }: { item: Leaderboard }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankBadgeText}>#{item.rank}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userLevel}>Level {item.level}</Text>
      </View>
      <Text style={styles.userPoints}>{item.points} pts</Text>
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
        <Text style={styles.headerTitle}>Leaderboard</Text>
      </View>

      {userRank > 0 && (
        <View style={styles.userStatsContainer}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 10 }}>Your Stats</Text>
          <View style={styles.userStatRow}>
            <Text style={styles.userStatLabel}>Rank</Text>
            <Text style={styles.userStatValue}>#{userRank}</Text>
          </View>
          <View style={styles.userStatRow}>
            <Text style={styles.userStatLabel}>Points</Text>
            <Text style={styles.userStatValue}>{userPoints}</Text>
          </View>
          <View style={styles.userStatRow}>
            <Text style={styles.userStatLabel}>Level</Text>
            <Text style={styles.userStatValue}>{userLevel}</Text>
          </View>
        </View>
      )}

      <Text style={styles.leaderboardTitle}>Top Players</Text>

      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.user_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
