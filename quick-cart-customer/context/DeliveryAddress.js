import React, { createContext, useContext, useState } from "react";

const DeliveryAddressContext = createContext();

export const useDeliveryAddress = () => useContext(DeliveryAddressContext);

export const DeliveryAddressProvider = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  return (
    <DeliveryAddressContext.Provider
      value={{ selectedAddress, setSelectedAddress }}
    >
      {children}
    </DeliveryAddressContext.Provider>
  );
};
