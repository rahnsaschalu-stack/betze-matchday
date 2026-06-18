import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { LocationCoords } from '@types/index';

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  updateInterval?: number; // milliseconds
  onLocationUpdate?: (coords: LocationCoords) => void;
}

export function useLocation(options: UseLocationOptions = {}) {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startLocationTracking = async () => {
      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setIsLoading(false);
          return;
        }

        // Get initial location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: options.enableHighAccuracy
            ? Location.Accuracy.BestForNavigation
            : Location.Accuracy.Balanced,
        });

        if (isMounted) {
          const coords = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            accuracy: currentLocation.coords.accuracy || undefined,
            altitude: currentLocation.coords.altitude || undefined,
            heading: currentLocation.coords.heading || undefined,
            speed: currentLocation.coords.speed || undefined,
          };
          setLocation(coords);
          options.onLocationUpdate?.(coords);
        }

        // Subscribe to location updates
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: options.enableHighAccuracy
              ? Location.Accuracy.BestForNavigation
              : Location.Accuracy.Balanced,
            timeInterval: options.updateInterval || 5000,
            distanceInterval: 10, // 10 meters
          },
          (newLocation) => {
            if (isMounted) {
              const coords = {
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                accuracy: newLocation.coords.accuracy || undefined,
                altitude: newLocation.coords.altitude || undefined,
                heading: newLocation.coords.heading || undefined,
                speed: newLocation.coords.speed || undefined,
              };
              setLocation(coords);
              options.onLocationUpdate?.(coords);
            }
          }
        );
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to get location');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    startLocationTracking();

    return () => {
      isMounted = false;
      locationSubscription.current?.remove();
    };
  }, []);

  return { location, error, isLoading };
}
