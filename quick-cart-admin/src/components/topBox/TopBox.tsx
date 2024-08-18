/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./topBox.scss";
import { ordersApiRequests, userApiRequest } from "../../api/api";

const TopBox = () => {
  const [recentUsersWithOrders, setRecentUsersWithOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentUsersWithOrders = async () => {
      try {
        // Fetch recent orders
        const ordersResponse = await ordersApiRequests.getOrders();
        const orders = ordersResponse.data;

        // Extract unique user IDs from orders
        const userIds = Array.from(
          new Set(orders.map((order: any) => order.userId))
        );

        // Initialize array to hold users
        const users = [];

        // Fetch each user and calculate total amount from their orders
        for (const userId of userIds as string[]) {
          // Explicitly type userId as string
          const userResponse = await userApiRequest.getUserById(userId);
          const user = userResponse.data.data;
          const userOrders = orders.filter(
            (order: any) => order.userId === userId
          );

          const totalAmount = userOrders.reduce(
            (acc: number, order: any) => acc + order.totalAmount,
            0
          );
          user.totalAmount = totalAmount;
          users.push(user);
        }
        // Sort users by their order timestamp (assuming order array is sorted by date)
        const sortedUsers = users.sort((a: any, b: any) => {
          const orderDateA = orders.find(
            (order: any) => order.user === a.id
          )?.createdAt;
          const orderDateB = orders.find(
            (order: any) => order.user === b.id
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
  }, []);

  return (
    <div className="topBox">
      <h1>Recent Users with Orders</h1>
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
