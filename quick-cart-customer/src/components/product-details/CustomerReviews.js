import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import styles from '../../screens/products/styles';

const CustomerReviews = ({ ratings, maskUserName }) => {
  const [showModal, setShowModal] = useState(false);

  const RatingItem = ({ rating }) => (
    <View style={styles.ratingItem}>
      <View style={{ flexDirection: "row" }}>
        <MaterialIcons name="person" size={18} />
        <Text>Customer: {maskUserName(rating.user)}</Text>
      </View>
      <Text>
        Rating:
        <AirbnbRating
          defaultRating={rating.rating}
          size={13}
          showRating={false}
        />
      </Text>
      <Text>Comment: {rating.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.vendorLabel}>Customer Reviews:</Text>
      {ratings.length > 0 ? (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <RatingItem rating={ratings[0]} />
          <View style={{ flexDirection: "row" }}>
            <Text>See All Reviews</Text>
            <AntDesign name="arrowright" size={20} color="#000" />
          </View>
        </TouchableOpacity>
      ) : (
        <Text>No ratings available for this product.</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <MaterialIcons name="close" size={24} />
            </TouchableOpacity>
            {ratings.map((rating) => (
              <RatingItem key={rating._id} rating={rating} />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerReviews;