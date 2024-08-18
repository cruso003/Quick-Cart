/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { userApiRequest } from "../../../api/api";
import ChartBox from "../ChartBox";

const UserStats = () => {
  const [, setUserData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApiRequest.getUsers();    
        const users = response.data.data;

        setUserData(users);

        // Calculate total users
        const totalUsersCount = users.length;
        setTotalUsers(totalUsersCount);

        // Calculate percentage change
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        const currentMonthUsers = users.filter(
          (user: any) => new Date(user.createdAt).getMonth() === currentMonth
        ).length;
        const lastMonthUsers = users.filter(
          (user: any) => new Date(user.createdAt).getMonth() === lastMonth
        ).length;

        const percentageChange = lastMonthUsers
          ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
          : 100;
        setPercentageChange(Number(percentageChange.toFixed(2)));

        // Prepare chart data - Monthly user count
        const monthlyUserCount = Array.from({ length: 12 }, (_, i) => {
          const monthUsers = users.filter(
            (user: any) => new Date(user.createdAt).getMonth() === i
          ).length;
          return { name: i + 1, users: monthUsers };
        });

        setChartData(monthlyUserCount);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const chartBoxUser = {
    color: "#8884d8",
    icon: "/user.svg",
    title: "Total Users",
    number: totalUsers,
    percentage: percentageChange,
    chartData: chartData,
    dataKey: "users",
  };

  return <ChartBox {...chartBoxUser} />;
};

export default UserStats;
