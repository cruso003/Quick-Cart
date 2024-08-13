import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './styles';

const NotificationItem = ({ icon, title, description, count, onPress }) => (
  <TouchableOpacity style={styles.notificationItem} onPress={onPress}>
    <View style={styles.notificationIconContainer}>
      <View style={styles.notificationIcon}>
        {icon}
      </View>
    </View>
    <View style={styles.notificationText}>
      <Text style={{ fontSize: 15 }}>{title}</Text>
      <Text numberOfLines={1} style={{ color: '#8f8f8f' }}>{description}</Text>
    </View>
    <View style={styles.notificationCount}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  </TouchableOpacity>
);

export default NotificationItem;
