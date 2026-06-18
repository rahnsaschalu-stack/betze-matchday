import * as Notifications from 'expo-notifications';
import supabase from './supabase';
import { Notification } from '@types/index';

/**
 * Register for push notifications
 */
export async function registerForPushNotifications(userId: string) {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { pushToken: null, error: 'Notification permissions not granted' };
    }

    // Get push token
    const pushToken = (await Notifications.getExpoPushTokenAsync()).data;

    // Save to database
    const { error } = await supabase.from('push_tokens').insert([
      {
        user_id: userId,
        token: pushToken,
        platform: 'expo',
      },
    ]);

    if (error) throw error;

    return { pushToken, error: null };
  } catch (error) {
    return { pushToken: null, error };
  }
}

/**
 * Send local notification
 */
export async function sendLocalNotification(title: string, body: string, data?: Record<string, any>) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null,
    });

    return { error: null };
  } catch (error) {
    return { error };
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(userId: string, limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { notifications: data as Notification[], error: null };
  } catch (error) {
    return { notifications: [], error };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return { error };
  }
}
