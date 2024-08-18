/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import BarChartBox from "../BarChartBox";
import { ordersApiRequests } from "../../../api/api";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ordersApiRequests.getOrders();

        // Calculate profit for each day
        const dailyProfitMap: Map<string, number> = new Map();

        // Process response.data (orders)
        response.data.forEach((order: any) => {
          order.products.forEach((product: any) => {
            const productCost = Number(product.product.discountPrice || product.product.price);
            const profit = productCost * 0.05; // 5% cut for the organization
            const orderDate = new Date(order.orderDate).toLocaleDateString();

            if (dailyProfitMap.has(orderDate)) {
              dailyProfitMap.set(
                orderDate,
                dailyProfitMap.get(orderDate)! + profit
              );
            } else {
              dailyProfitMap.set(orderDate, profit);
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
  }, []);

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
