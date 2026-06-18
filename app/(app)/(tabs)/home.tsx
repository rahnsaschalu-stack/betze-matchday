import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '@store/authStore';
import { useGamificationStore } from '@store/gamificationStore';
import { FontAwesome } from '@expo/vector-icons';
import * as checkinsService from '@services/checkins';
import { useLocation } from '@hooks/useLocation';

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
    marginBottom: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF4444',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  checkinButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checkinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function HomeScreen() {
  const { userId } = useAuthStore();
  const { userPoints, userRank, userLevel, fetchUserStats } = useGamificationStore();
  const { location } = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<Date | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserStats(userId);
    }
  }, [userId]);

  const handleCheckin = async () => {
    if (!userId || !location) return;

    setCheckingIn(true);
    const { error } = await checkinsService.createCheckin(userId, location);
    setCheckingIn(false);

    if (!error) {
      setLastCheckin(new Date());
      await fetchUserStats(userId);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await fetchUserStats(userId);
    }
    setRefreshing(false);
  };

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
        <Text style={styles.headerTitle}>Betze Matchday 🏟️</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Rank</Text>
          <Text style={styles.cardValue}>#{userRank}</Text>
        </View>

        <View style={styles.statRow}>
          <View style={[styles.card, styles.statItem]}>
            <Text style={styles.cardTitle}>Points</Text>
            <Text style={styles.cardValue}>{userPoints}</Text>
          </View>
          <View style={[styles.card, styles.statItem]}>
            <Text style={styles.cardTitle}>Level</Text>
            <Text style={styles.cardValue}>{userLevel}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkinButton, checkingIn && { opacity: 0.6 }]}
          onPress={handleCheckin}
          disabled={checkingIn}
        >
          <FontAwesome name="map-marker" size={20} color="#fff" />
          <Text style={styles.checkinButtonText}>
            {checkingIn ? 'Checking in...' : 'Stadium Checkin'}
          </Text>
        </TouchableOpacity>

        {lastCheckin && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Checkin</Text>
            <Text style={styles.cardValue}>{lastCheckin.toLocaleTimeString()}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
