import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, AntDesign, Feather, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from './context/CartContext';
import { useAuth } from '../auth/context';
import NotificationItem from '../../components/notification/NotificationItems';
import styles from '../../components/notification/styles';

const Notifications = () => {
  const { cart } = useCart();
  const [cartLength, setCartLength] = useState(0);
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleMessageOpen = () => {
    navigation.navigate(user ? 'Messages' : 'Login');
  };

  useEffect(() => {
    setCartLength(cart ? cart.length : 0);
  }, [cart]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Cart')}
          >
            <MaterialIcons name="shopping-cart-checkout" size={28} color="#000" />
            {cartLength > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>{cartLength}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={handleMessageOpen}
          >
            <Ionicons name="chatbubbles" size={28} color="#000" />
            <View style={styles.messageBadge}>
              <Text style={styles.badgeText}>8</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Order Updates</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ alignSelf: 'center', fontSize: 13, color: '#ee4d2d' }}>
              Read All(7)
            </Text>
          </TouchableOpacity>
        </View>

        <NotificationItem
          icon={<AntDesign name="tago" size={28} color="#e89b17" />}
          title="Promotions"
          description="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"
          count="240"
        />
        <NotificationItem
          icon={<SimpleLineIcons name="social-facebook" size={28} color="#26aa99" />}
          title="Social Updates"
          description="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"
          count="99"
        />
        <NotificationItem
          icon={<Feather name="bell" size={28} color="#26aa99" />}
          title="Activities"
          description="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"
          count="11"
        />
        <NotificationItem
          icon={<SimpleLineIcons name="handbag" size={28} color="#ef5b3d" />}
          title="MyEcommerce Updates"
          description="Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"
          count="7"
        />

        <TouchableOpacity style={[styles.notificationDetail, styles.cancellationBackground]} onPress={() => {}}>
          <View style={styles.detailIconContainer}>
            <View style={styles.detailIcon}>
              <Feather name="bell" size={28} color="#26aa99" />
            </View>
          </View>
          <View style={styles.detailText}>
            <Text numberOfLines={1} style={{ fontSize: 15, marginBottom: 2 }}>
              Cancellation Request Accepted
            </Text>
            <Text numberOfLines={6} style={{ color: '#8f8f8f', marginBottom: 2 }}>
              Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
              <Text style={{ color: '#14c3ab' }}>Order #4359874239354987</Text> ut labore et dolore magna aliqua. Ut enim ad minim, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Text style={styles.detailDate}>Jul 22, 2024</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
