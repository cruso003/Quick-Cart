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
import { useAuth } from "../../contexts/AuthContext";

const BigChartBox = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const { user } = useAuth();
  
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
  
          // Filter products and orders for the current month and store
          products.forEach((product: any) => {
            if (product.storeId === user.storeId && new Date(product.lastUpdated).getMonth() === i) {
              monthData.products++;
            }
          });
  
          orders.forEach((order: any) => {
            if (new Date(order.orderDate).getMonth() === i) {
              // Filter orders to include only those containing products from the user's store
              const storeProducts = order.products.filter(
                (orderProduct: any) => orderProduct.storeId === user.storeId
              );
  
              // Count products and sum revenue
              storeProducts.forEach((orderProduct: any) => {
                monthData.products += orderProduct.quantity;
                monthData.revenue += orderProduct.quantity * (orderProduct.product.discountPrice || orderProduct.product.price);
              });
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
  }, [user.storeId]);

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
