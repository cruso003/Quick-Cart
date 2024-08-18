/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ordersApiRequests } from "../../../api/api";
import ChartBox from "../ChartBox";
import { useAuth } from "../../../contexts/AuthContext";

const RevenueStats = () => {
  const [, setOrderData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersApiRequests.getOrders();
        const orders = response.data;
  
        // Filter orders to include only those with the user's storeId
        const filteredOrders = orders.filter((order: any) =>
          order.products.some((product: any) => product.storeId === user.storeId)
        );
  
        setOrderData(filteredOrders);
  
        // Calculate total revenue from filtered orders
        const revenue = filteredOrders.reduce((acc: number, order: any) => {
          const orderRevenue = order.products
            .filter((product: any) => product.storeId === user.storeId)
            .reduce((orderAcc: number, product: any) => {
              return orderAcc + product.product.price * product.quantity;
            }, 0);
          return acc + orderRevenue;
        }, 0);
  
        setTotalRevenue(revenue);
  
        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  
        const currentMonthRevenue = filteredOrders.reduce((acc: number, order: any) => {
          if (new Date(order.orderDate).getMonth() === currentMonth) {
            const orderRevenue = order.products
              .filter((product: any) => product.storeId === user.storeId)
              .reduce((orderAcc: number, product: any) => {
                return orderAcc + product.product.price * product.quantity;
              }, 0);
            return acc + orderRevenue;
          }
          return acc;
        }, 0);
  
        const lastMonthRevenue = filteredOrders.reduce((acc: number, order: any) => {
          if (new Date(order.orderDate).getMonth() === lastMonth) {
            const orderRevenue = order.products
              .filter((product: any) => product.storeId === user.storeId)
              .reduce((orderAcc: number, product: any) => {
                return orderAcc + product.product.price * product.quantity;
              }, 0);
            return acc + orderRevenue;
          }
          return acc;
        }, 0);
  
        const revenueChange = lastMonthRevenue
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 100;
  
        setPercentageChange(Number(revenueChange.toFixed(2)));
  
        // Prepare chart data - Monthly revenue
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
          const monthRevenue = filteredOrders.reduce((acc: number, order: any) => {
            if (new Date(order.orderDate).getMonth() === i) {
              const orderRevenue = order.products
                .filter((product: any) => product.storeId === user.storeId)
                .reduce((orderAcc: number, product: any) => {
                  return orderAcc + product.product.price * product.quantity;
                }, 0);
              return acc + orderRevenue;
            }
            return acc;
          }, 0);
          return { name: i + 1, revenue: monthRevenue };
        });
  
        setChartData(monthlyRevenue);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    fetchOrders();
  }, [user.storeId]);
  

  const chartBoxRevenue = {
    color: "#ffc658",
    icon: "/revenueIcon.svg",
    title: "Total Revenue",
    number: totalRevenue.toFixed(2), 
    percentage: percentageChange,
    chartData: chartData,
    dataKey: "revenue",
  };

  return <ChartBox {...chartBoxRevenue} />;
};

export default RevenueStats;
