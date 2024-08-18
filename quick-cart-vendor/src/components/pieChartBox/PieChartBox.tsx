/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";
import { ordersApiRequests } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const PieChartBox = () => {
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await ordersApiRequests.getOrders();
        const orders = ordersResponse.data;
  
        // Calculate revenue for each category related to the user's products
        const categoryDataMap = new Map();
  
        orders.forEach((order: any) => {
          order.products.forEach((orderProduct: any) => {
            // Filter products based on the user's store
            if (orderProduct.storeId === user.storeId) {
              const categoryName = orderProduct.categoryName;
              const productPrice = Number(orderProduct.product.discountPrice || orderProduct.product.price);
              const quantity = orderProduct.quantity || 1;
  
              const revenue = productPrice * quantity;
  
              if (categoryDataMap.has(categoryName)) {
                categoryDataMap.set(
                  categoryName,
                  categoryDataMap.get(categoryName) + revenue
                );
              } else {
                categoryDataMap.set(categoryName, revenue);
              }
            }
          });
        });
  
        // Convert map to array for PieChart data format
        const pieChartData = Array.from(categoryDataMap.entries()).map(
          ([name, value]) => ({
            name,
            value,
            color: getRandomColor(), // Replace with your color logic if needed
          })
        );
  
        setPieChartData(pieChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user.storeId]);
  

  // Function to generate random color (if needed)
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  // Function to format value as currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="pieChartBox">
      <h1>Revenue by Product Category</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Pie
              data={pieChartData}
              innerRadius={"70%"}
              outerRadius={"90%"}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {pieChartData.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {pieChartData.map((item, index) => (
          <div className="option" key={`option-${index}`}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span>{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
