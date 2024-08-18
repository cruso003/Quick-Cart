/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { productApiRequests } from "../../../api/api";
import ChartBox from "../ChartBox";
import { useAuth } from "../../../contexts/AuthContext";

const ProductStats = () => {
  const [, setProductData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApiRequests.getProducts();
        const products = response.data;
  
        // Filter products to include only those with the user's storeId
        const filteredProducts = products.filter(
          (product: any) => product.storeId === user.storeId
        );
  
        setProductData(filteredProducts);
  
        // Calculate total products
        const totalProductsCount = filteredProducts.length;
        setTotalProducts(totalProductsCount);
  
        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  
        const currentMonthProducts = filteredProducts.filter(
          (product: any) =>
            new Date(product.createdAt).getMonth() === currentMonth
        ).length;
        const lastMonthProducts = filteredProducts.filter(
          (product: any) => new Date(product.createdAt).getMonth() === lastMonth
        ).length;
  
        let percentageChange = 0;
        if (lastMonthProducts !== 0) {
          percentageChange =
            ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100;
        } else if (currentMonthProducts !== 0) {
          percentageChange = 100;
        }
        setPercentageChange(Number(percentageChange.toFixed(2)));
  
        // Prepare chart data - Monthly product count
        const monthlyProductCount = Array.from({ length: 12 }, (_, i) => {
          const monthProducts = filteredProducts.filter(
            (product: any) => new Date(product.createdAt).getMonth() === i
          ).length;
          return { name: i + 1, products: monthProducts };
        });
  
        setChartData(monthlyProductCount);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [user.storeId]);
  

  const chartBoxProduct = {
    color: "#82ca9d",
    icon: "/calendar.svg",
    title: "Total Products",
    number: totalProducts,
    percentage: percentageChange,
    chartData: chartData,
    dataKey: "products",
  };

  return <ChartBox {...chartBoxProduct} />;
};

export default ProductStats;
