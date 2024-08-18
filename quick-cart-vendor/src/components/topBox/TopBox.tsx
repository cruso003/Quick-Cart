/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./topBox.scss";
import { ordersApiRequests, userApiRequest } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const TopBox = () => {
  const [recentUsersWithOrders, setRecentUsersWithOrders] = useState<any[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchRecentUsersWithOrders = async () => {
      try {
        // Fetch recent orders
        const ordersResponse = await ordersApiRequests.getOrders();
        const orders = ordersResponse.data;
  
        // Filter orders to include only those with products from the user's store
        const filteredOrders = orders.filter((order: any) =>
          order.products.some((product: any) => product.storeId === user.storeId)
        );
  
        // Extract unique user IDs from filtered orders
        const userIds = Array.from(
          new Set(filteredOrders.map((order: any) => order.userId))
        );
  
        // Initialize array to hold users
        const users = [];
  
        // Fetch each user and calculate total amount from their filtered orders
        for (const userId of userIds as string[]) {
          // Explicitly type userId as string
          const userResponse = await userApiRequest.getUserById(userId);
          const fetchedUser = userResponse.data.data;
  
          // Filter orders for the current user and seller's store
          const userOrders = filteredOrders.filter(
            (order: any) => order.userId === userId
          );
  
          // Calculate the total amount spent in the seller's store
          const totalAmount = userOrders.reduce((acc: number, order: any) => {
            const storeTotal = order.products
              .filter((product: any) => product.storeId === user.storeId)
              .reduce((sum: number, product: any) => sum + product.product.price * product.quantity, 0);
            return acc + storeTotal;
          }, 0);
  
          fetchedUser.totalAmount = totalAmount;
          users.push(fetchedUser);
        }
  
        // Sort users by their order timestamp (assuming order array is sorted by date)
        const sortedUsers = users.sort((a: any, b: any) => {
          const orderDateA = filteredOrders.find(
            (order: any) => order.userId === a.id
          )?.createdAt;
          const orderDateB = filteredOrders.find(
            (order: any) => order.userId === b.id
          )?.createdAt;
          return (
            new Date(orderDateB).getTime() - new Date(orderDateA).getTime()
          );
        });
  
        // Get the 7 most recent users
        const recentUsers = sortedUsers.slice(0, 7);
  
        // Set state with recent users
        setRecentUsersWithOrders(recentUsers);
      } catch (error) {
        console.error("Error fetching recent users with orders:", error);
      }
    };
  
    fetchRecentUsersWithOrders();
  }, [user.storeId]);
  
  

  return (
    <div className="topBox">
      <h1>Recent Customers</h1>
      <div className="list">
        {recentUsersWithOrders.map((user, index) => (
          <div className="listItem" key={index}>
            <div className="user">
              <img src={user.avatar ? user.avatar : "/noavatar.png"} alt="" />
              <div className="userTexts">
                <span className="username">{user.name}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
            <span className="amount">${user.totalAmount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBox;
