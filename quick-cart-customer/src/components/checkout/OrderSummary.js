import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '../../screens/checkout/styles';

const OrderSummary = ({ stepOne, stepTwo, selectedPaymentMethod, subtotalPrice, calculateGrandTotal }) => (
    <View>
      {stepOne.cartItems.map((item, i) => (
        <View key={i} style={{ padding: 15 }}>
        <Text style={{ fontSize: 17, marginBottom: 10 }}>
          Shipping Address
        </Text>

        {/* Check if selectedPickupStation is available */}
        {item.selectedPickupStation ? (
          // If selectedPickupStation is available, use its information
          <>
            <Text style={{ color: "#858585", marginBottom: 20 }}>
              {item.selectedPickupStation.name}
            </Text>
            <Text style={{ color: "#858585" }}>
              {item.selectedPickupStation.address.street}
            </Text>
            <Text style={{ color: "#858585" }}>
              {item.selectedPickupStation.address.city}{" "}
              {item.selectedPickupStation.address.state}
            </Text>
          </>
        ) : (
          // If selectedPickupStation is not available, fall back to stepTwo
          <>
            <Text style={{ color: "#858585", marginBottom: 20 }}>
              {stepTwo.fullName}
            </Text>
            <Text style={{ color: "#858585" }}>
              {stepTwo.streetAddress}
            </Text>
            <Text style={{ color: "#858585" }}>
              {stepTwo.city} {stepTwo.state}
            </Text>
          </>
        )}

        {/* Displaying other item information */}
        <View style={styles.productInfo}>
          <Text style={{ color: "#858585" }}>Product</Text>
          <Text style={{ fontWeight: "200" }}>
            {item.product.name.substr(0, 12) + "..."}
          </Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={{ color: "#858585" }}>Price</Text>
          <Text style={{ fontWeight: "bold" }}>
            $
            {item.amount
              ? item.amount.toFixed(2)
              : item.discountPrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={{ color: "#858585" }}>
            {item.shipmentOption}
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            ${item.deliveryFee ? item.deliveryFee.toFixed(2) : 0}
          </Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={{ color: "#858585" }}>Sub Total</Text>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            $
            {(
              (item.amount ? item.amount : item.discountPrice) +
              item.deliveryFee
            ).toFixed(2)}
          </Text>
        </View>
      </View>
      ))}
    </View>
  );
  

export default OrderSummary