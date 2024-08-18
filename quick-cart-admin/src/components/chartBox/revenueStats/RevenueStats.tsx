/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ordersApiRequests } from "../../../api/api";
import ChartBox from "../ChartBox";

const RevenueStats = () => {
  const [, setOrderData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersApiRequests.getOrders();
        const orders = response.data;

        setOrderData(orders);

        // Calculate total revenue
        const revenue = orders.reduce((acc: number, order: any) => {
          return acc + order.totalAmount;
        }, 0);

        setTotalRevenue(revenue);

        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        const currentMonthRevenue = orders.reduce((acc: number, order: any) => {
          if (new Date(order.orderDate).getMonth() === currentMonth) {
            return acc + order.totalAmount;
          }
          return acc;
        }, 0);

        const lastMonthRevenue = orders.reduce((acc: number, order: any) => {
          if (new Date(order.orderDate).getMonth() === lastMonth) {
            return acc + order.totalAmount;
          }
          return acc;
        }, 0);

        const revenueChange = lastMonthRevenue
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 100;

        setPercentageChange(Number(revenueChange.toFixed(2)));

        // Prepare chart data - Monthly revenue
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
          const monthRevenue = orders.reduce((acc: number, order: any) => {
            if (new Date(order.orderDate).getMonth() === i) {
              return acc + order.totalAmount;
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
  }, []);

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
