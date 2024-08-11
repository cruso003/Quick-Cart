import { Link } from "react-router-dom";
import "./navbar.scss";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <div className="navbar">
      <div className="logo">
       <Link to="/">
       <span>Quick-Cart Vendor</span>
       </Link>
      </div>
      <div className="icons">
       {/* User Image and Name (Link to Profile) */}
       <Link to="/profile" className="user">
          <img src={user.avatar || "/noavatar.png"} alt="User Avatar" />
          <span>{user.name}</span>
        </Link>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;