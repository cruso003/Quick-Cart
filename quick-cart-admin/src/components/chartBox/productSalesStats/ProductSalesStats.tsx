/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ordersApiRequests } from "../../../api/api"; 
import ChartBox from "../ChartBox";

const ProductSalesStats = () => {
  const [, setOrdersData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalProductsSold, setTotalProductsSold] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersApiRequests.getOrders(); 
        const orders = response.data;
        

        setOrdersData(orders);

        // Calculate total products sold
        const totalProducts = orders.reduce((acc: number, order: any) => {
          return (
            acc +
            order.products.reduce((accProduct: number, product: any) => {
              return accProduct + product.quantity;
            }, 0)
          );
        }, 0);
        setTotalProductsSold(totalProducts);

        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        const currentMonthProducts = orders.reduce((acc: number, order: any) => {
          if (new Date(order.orderDate).getMonth() === currentMonth) {
            return (
              acc +
              order.products.reduce((accProduct: number, product: any) => {
                return accProduct + product.quantity;
              }, 0)
            );
          }
          return acc;
        }, 0);

        const lastMonthProducts = orders.reduce((acc: number, order: any) => {
          if (new Date(order.orderDate).getMonth() === lastMonth) {
            return (
              acc +
              order.products.reduce((accProduct: number, product: any) => {
                return accProduct + product.quantity;
              }, 0)
            );
          }
          return acc;
        }, 0);

        const percentageChange = lastMonthProducts
          ? ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100
          : 100;
        setPercentageChange(Number(percentageChange.toFixed(2)));

        // Prepare chart data - Monthly product sales count
        const monthlyProductSales = Array.from({ length: 12 }, (_, i) => {
          const monthProducts = orders.reduce((acc: number, order: any) => {
            if (new Date(order.orderDate).getMonth() === i) {
              return (
                acc +
                order.products.reduce((accProduct: number, product: any) => {
                  return accProduct + product.quantity;
                }, 0)
              );
            }
            return acc;
          }, 0);
          return { name: i + 1, products: monthProducts };
        });

        setChartData(monthlyProductSales);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const chartBoxProductSales = {
    color: "#8884d8",
    icon: "/product.svg",
    title: "Total Products Sold",
    number: totalProductsSold,
    percentage: percentageChange,
    chartData: chartData,
    dataKey: "products",
  };

  return <ChartBox {...chartBoxProductSales} />;
};

export default ProductSalesStats;
