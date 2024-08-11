import { Link } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="quick-cart.svg" alt="" />
       <Link to="/">
       <span>Quick-Cart Vendor</span>
       </Link>
      </div>
      <div className="icons">
      
       {/* User Image and Name (Link to Profile) */}
       <Link to="/profile" className="user">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQIM57KDHyxTdRFhpTOqqe4SVeoMYoL2miww&s" alt="User Avatar" />
          <span>Jane Doe</span>
        </Link>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
