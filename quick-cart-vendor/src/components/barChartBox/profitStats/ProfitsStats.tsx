/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import BarChartBox from "../BarChartBox";
import { ordersApiRequests } from "../../../api/api";
import { useAuth } from "../../../contexts/AuthContext";

type ChartDataItem = {
  name: string;
  profit: number;
};

type BarChartBoxRevenue = {
  title: string;
  color: string;
  dataKey: string;
  chartData: ChartDataItem[];
};

const ProfitStats = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ordersApiRequests.getOrders();
  
        // Calculate profit for each day
        const dailyProfitMap: Map<string, number> = new Map();
  
        // Process response.data (orders)
        response.data.forEach((order: any) => {
          // Filter products that belong to the user
          const userProducts = order.products.filter(
            (product: any) => product.product.storeId === user.storeId
          );
  
          userProducts.forEach((product: any) => {
            const productCost = Number(product.product.discountPrice || product.product.price);
            const quantity = product.quantity || 1;
            const adminCut = productCost * 0.05 * quantity; // 5% cut for the organization per product quantity
            const userProfit = (productCost * quantity) - adminCut; // User's profit considering quantity
            const orderDate = new Date(order.orderDate).toLocaleDateString();
  
            if (dailyProfitMap.has(orderDate)) {
              dailyProfitMap.set(
                orderDate,
                dailyProfitMap.get(orderDate)! + userProfit
              );
            } else {
              dailyProfitMap.set(orderDate, userProfit);
            }
          });
        });
  
        // Convert map to array for chart data format
        const chartData: ChartDataItem[] = Array.from(
          dailyProfitMap.entries()
        ).map(([name, profit]) => ({
          name,
          profit: Number(profit.toFixed(2)),
        }));
  
        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user.storeId]);
  
  

  const barChartBoxRevenue: BarChartBoxRevenue = {
    title: "Profit Earned",
    color: "#8884d8",
    dataKey: "profit",
    chartData: chartData,
  };

  return (
    <BarChartBox
      title={barChartBoxRevenue.title}
      color={barChartBoxRevenue.color}
      dataKey={barChartBoxRevenue.dataKey}
      chartData={barChartBoxRevenue.chartData}
    />
  );
};

export default ProfitStats;
