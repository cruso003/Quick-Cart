import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";

export default styles = StyleSheet.create({
  addToWishlistButton: {
    backgroundColor: colors.wishlist,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    opacity: 0.7,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centerElement: { justifyContent: "center", alignItems: "center" },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
  },
  shareButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    marginBottom: 10,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    backgroundColor: colors.border,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 10,
  },
  vendorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  vendorLabel: {
    fontSize: 16,
    color: colors.gray,
    marginRight: 5,
  },
  vendorName: {
    fontSize: 16,
    color: colors.black,
  },
  pricesContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  pricesDirection: {
    flexDirection: "row",
  },
  variablePriceRange: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  productPrice: {
    color: "#d7263c",
    fontSize: 18,
    fontWeight: "bold",
  },
  regularPrice: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "line-through",
  },
  salePrice: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "bold",
  },
  discount: {
    fontSize: 13,
    color: "#f00",
    marginLeft: 15,
    fontWeight: "bold",
  },
  ratingContainer: {
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.black,
  },
  store: {
    padding: 10,
    marginHorizontal: 10,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingItem: {
    marginBottom: 10,
  },
  airbnbRatingContainer: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
    overflow: "scroll",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  deliveryContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f4f4f4",
  },
  deliveryTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionDetails: {
    marginBottom: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  optionTitle: {
    marginLeft: 2,
    fontWeight: "bold",
  },
  changeText: {
    fontSize: 11,
    color: colors.danger,
    padding: 5,
  },
});
