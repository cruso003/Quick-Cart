import client from "../client";

const pickupEndpoint = "/pickup-stations";
const shipmentEndpoint = "/shipments";

const getPickupStations = () => client.get(`${pickupEndpoint}`);
const getShipments = () => client.get(`${shipmentEndpoint}`);

export default {
  getPickupStations,
  getShipments,
};
