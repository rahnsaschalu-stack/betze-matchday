import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '@store/authStore';
import { useLocation } from '@hooks/useLocation';
import { FontAwesome } from '@expo/vector-icons';
import * as checkinsService from '@services/checkins';

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
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  coordLabel: {
    fontWeight: '600',
    color: '#666',
  },
  coordValue: {
    color: '#FF4444',
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  statusAtStadium: {
    backgroundColor: '#4CAF50',
  },
  statusNearStadium: {
    backgroundColor: '#FFC107',
  },
  statusAwayFromStadium: {
    backgroundColor: '#FF9800',
  },
  checkinButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
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
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default function CheckinScreen() {
  const { userId } = useAuthStore();
  const { location, isLoading: locationLoading, error: locationError } = useLocation({
    enableHighAccuracy: true,
    updateInterval: 10000,
  });

  const [checkingIn, setCheckingIn] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<any>(null);
  const [distanceFromStadium, setDistanceFromStadium] = useState<number | null>(null);
  const [isAtStadium, setIsAtStadium] = useState(false);

  useEffect(() => {
    if (location) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        49.4461,
        7.764
      );
      setDistanceFromStadium(Math.round(distance));
      setIsAtStadium(distance <= 500);
    }
  }, [location]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const handleCheckin = async () => {
    if (!userId || !location) {
      Alert.alert('Error', 'Location not available. Please enable location services.');
      return;
    }

    setCheckingIn(true);
    const { checkin, error } = await checkinsService.createCheckin(userId, location);
    setCheckingIn(false);

    if (!error && checkin) {
      setLastCheckin(checkin);
      Alert.alert('Checkin Successful', isAtStadium ? '🟢 You are at the stadium!' : '📍 Checkin recorded');
    } else {
      Alert.alert('Error', 'Failed to create checkin');
    }
  };

  if (locationLoading || !location) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF4444" />
        <Text style={{ marginTop: 15, color: '#666' }}>Getting your location...</Text>
      </View>
    );
  }

  if (locationError && !userId) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF4444" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stadium Checkin</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={[styles.checkinButton, checkingIn && { opacity: 0.6 }]}
          onPress={handleCheckin}
          disabled={checkingIn}
        >
          <FontAwesome name="map-marker" size={20} color="#fff" />
          <Text style={styles.checkinButtonText}>
            {checkingIn ? 'Checking in...' : 'Checkin Now'}
          </Text>
        </TouchableOpacity>

        {locationError && <Text style={styles.errorText}>{locationError}</Text>}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Your Location</Text>
          <View style={styles.coordsRow}>
            <Text style={styles.coordLabel}>Latitude</Text>
            <Text style={styles.coordValue}>{location?.latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.coordsRow}>
            <Text style={styles.coordLabel}>Longitude</Text>
            <Text style={styles.coordValue}>{location?.longitude.toFixed(6)}</Text>
          </View>
          <View style={styles.coordsRow}>
            <Text style={styles.coordLabel}>Accuracy</Text>
            <Text style={styles.coordValue}>{Math.round(location?.accuracy || 0)}m</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏟️ Stadium Distance</Text>
          <Text style={styles.cardContent}>
            {distanceFromStadium ? `${distanceFromStadium}m` : 'Calculating...'}
          </Text>
          <View
            style={[
              styles.statusBadge,
              isAtStadium
                ? styles.statusAtStadium
                : distanceFromStadium && distanceFromStadium < 2000
                  ? styles.statusNearStadium
                  : styles.statusAwayFromStadium,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {isAtStadium ? '🟢 At Stadium' : distanceFromStadium && distanceFromStadium < 2000 ? '🟡 Near Stadium' : '🔴 Away from Stadium'}
            </Text>
          </View>
        </View>

        {lastCheckin && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✓ Last Checkin</Text>
            <Text style={styles.cardContent}>
              {new Date(lastCheckin.created_at).toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
