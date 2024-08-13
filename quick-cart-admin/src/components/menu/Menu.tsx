import { Link } from "react-router-dom";
import "./menu.scss";
import { menu } from "../../../data";
import { useAuth } from "../../contexts/AuthContext";

const Menu = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link to={listItem.url} className="listItem" key={listItem.id}>
              <img src={listItem.icon} alt="" />
              <span className="listItemTitle">{listItem.title}</span>
            </Link>
          ))}
        </div>
      ))}
      <div className="item">
        <span className="title">system settings</span>
        <div className="listItem" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <img src="/logout.svg" alt="" /> 
          <span className="listItemTitle">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
