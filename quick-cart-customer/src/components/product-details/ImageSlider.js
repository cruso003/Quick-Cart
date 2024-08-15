import React from 'react';
import { View, Image } from 'react-native';
import Swiper from 'react-native-swiper';

const ImageSlider = ({ images }) => (
  <View style={{ height: 175, marginBottom: 10 }}>
    <Swiper
      loop={true}
      autoplay={true}
      autoplayTimeout={2.5}
      activeDotColor={"#ff4800"}
      bounces={true}
      paginationStyle={{ position: "absolute", bottom: 0 }}
    >
      {images.map((image, i) => (
        <View key={i} style={{ alignItems: "center" }}>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 175 }}
          />
        </View>
      ))}
    </Swiper>
  </View>
);

export default ImageSlider;
