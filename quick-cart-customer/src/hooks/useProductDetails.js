import { useEffect, useState } from "react";
import { useCart } from "../../context/cart";
import { useWishlist } from "../../context/wishlist";
import { useAuth } from "../../context/auth";
import { useDeliveryAddress } from "../../context/DeliveryAddress";
import usersApi from "../../api/user/user";
import shipmentApi from "../../api/shipment/shipment";
import { format } from "date-fns";

export const useProductDetails = (product, route, shipmentOption) => {
  const { cart } = useCart();
  const { isProductInWishlist } = useWishlist();
  const user = useAuth();
  const { selectedAddress, setSelectedAddress } = useDeliveryAddress();

  const [productState, setProductState] = useState({
    isInWishlist: false,
    isInCart: false,
    deliveryFee: null,
    expectedDeliveryDate: null,
    seller: [],
    buyer: [],
    selectedVariations: {},
    filteredPickupStations: [],
    pickupStations: [],
    loading: false,
  });

  useEffect(() => {
    setProductState((prev) => ({ ...prev, product }));

    const fetchSender = async () => {
      if (user?.user?.id) {
        try {
          const response = await usersApi.getUserById(user.user.id);
          setProductState((prev) => ({
            ...prev,
            buyer: response.data.data,
          }));
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    const fetchPickupStations = async () => {
      try {
        setProductState((prev) => ({ ...prev, loading: true }));
        const response = await shipmentApi.getPickupStations();
        setProductState((prev) => ({
          ...prev,
          pickupStations: response.data,
          filteredPickupStations: response.data.filter((station) =>
            selectedAddress?.state
              ? station.address.state === selectedAddress.state
              : true
          ),
        }));
      } catch (error) {
        console.error("Error fetching pickup stations:", error);
      } finally {
        setProductState((prev) => ({ ...prev, loading: false }));
      }
    };

    if (shipmentOption === "Pickup Station") {
      fetchPickupStations();
    }

    fetchSender();

    const calculateDeliveryFee = () => {
      if (!product) return;
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 2);
      setProductState((prev) => ({
        ...prev,
        expectedDeliveryDate: format(deliveryDate, "MMM d"),
      }));
    };

    calculateDeliveryFee();

  }, [product, cart, selectedAddress, shipmentOption]);

  return {
    ...productState,
    setProductState,
    user,
    setSelectedAddress,
  };
};
