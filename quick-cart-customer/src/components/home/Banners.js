import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import BannersApi from "../api/banners";
import { ActivityIndicator } from "react-native-paper";
import colors from "../../../theme/colors";

const Banners = ({ navigation }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = (await BannersApi.getBanners()).data;
        setBanners(response);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <View style={{ height: 20 }}>
        <ActivityIndicator size="small" color="#ef5739" />
      </View>
    );
  }

  return (
    <Swiper
      height={150}
      activeDotColor={colors.primary}
      autoplay
      autoplayTimeout={4}
    >
      {banners.map((banner) => (
        <TouchableOpacity
          key={banner._id}
          onPress={() => {
            navigation.navigate("BannerProducts", {
              bannerId: banner._id,
            });
          }}
          style={{ borderWidth: 1 }}
        >
          <Image
            source={{ uri: banner.imageUrl }}
            style={{
              width: "100%",
              height: 150,
            }}
          />
        </TouchableOpacity>
      ))}
    </Swiper>
  );
};

export default Banners;
