/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import "./bigChartBox.scss";
import { productApiRequests, ordersApiRequests } from "../../api/api";

const BigChartBox = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await productApiRequests.getProducts();
        const ordersResponse = await ordersApiRequests.getOrders();

        const products = productsResponse.data;
        const orders = ordersResponse.data;

        // Aggregate data on a monthly basis
        const data = Array.from({ length: 12 }, (_, i) => {
          const monthData = {
            name: getMonthName(i),
            products: 0,
            revenue: 0,
          };

          // Filter products and orders for the current month
          products.forEach((product: any) => {
            if (new Date(product.lastUpdated).getMonth() === i) {
              monthData.products++;
            }
          });

          orders.forEach((order: any) => {
            if (new Date(order.orderDate).getMonth() === i) {
              // Count products
              order.products.forEach((product: any) => {
                monthData.products += product.quantity;
              });

              // Sum revenue
              monthData.revenue += order.totalAmount;
            }
          });

          return monthData;
        });

        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to get month name based on index
  const getMonthName = (monthIndex: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  };

  return (
    <div className="bigChartBox">
      <h1>Revenue Analytics</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="products"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;
