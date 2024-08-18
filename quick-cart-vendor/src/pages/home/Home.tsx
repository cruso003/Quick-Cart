import BarChartBox from "../../components/barChartBox/BarChartBox";
import ProfitStats from "../../components/barChartBox/profitStats/ProfitsStats";
import BigChartBox from "../../components/bigChartBox/BigChartBox";
import ProductStats from "../../components/chartBox/productStats/ProductStats";
import RevenueStats from "../../components/chartBox/revenueStats/RevenueStats";
import ProductSalesStats from "../../components/chartBox/productSalesStats/ProductSalesStats";
import PieChartBox from "../../components/pieChartBox/PieChartBox";
import TopBox from "../../components/topBox/TopBox";
import { barChartBoxVisit } from "../../../data";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <div className="box box1">
        <TopBox />
      </div>
      <div className="box box3">
        <ProductStats />
      </div>
      <div className="box box4">
        <PieChartBox />
      </div>
      <div className="box box5">
        <RevenueStats />
      </div>
      <div className="box box6">
        <ProductSalesStats />
      </div>
      <div className="box box7">
        <BigChartBox />
      </div>
      <div className="box box8">
        <BarChartBox {...barChartBoxVisit} />
      </div>
      <div className="box box9">
        <ProfitStats />
      </div>
    </div>
  );
};

export default Home;
