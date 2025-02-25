import { FiCalendar, FiHome, FiPlusSquare, FiShoppingCart, FiUser } from "react-icons/fi";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export const DesktopMenu = () => {
  const location = useLocation();
  const currentRoute = location.pathname;
  const {cart} = useCart();

  const menuItemClass = "flex items-center space-x-2 p-1";
  const activeMenuItemClass = "flex items-center space-x-2 bg-rust text-white p-1 rounded-md";
  
  function getMenuItemClass(path: string) {
    return currentRoute === path ? activeMenuItemClass : menuItemClass;
  }

  return (
    <div className="fixed top-12 w-42 h-screen bg-white py-8 px-2 text-sandy font-bold border-r-1 flex flex-col justify-between">
      <div className="space-y-4">
        <div className={getMenuItemClass("/")}>
          <FiHome />
          <Link to="/">Home</Link>
        </div>
        <div className={getMenuItemClass("/cart")}>
          <FiShoppingCart />
          <Link to="/cart">Cart {cart.length > 0 && `(${cart.length})`}</Link>
        </div>
        <div className={getMenuItemClass("/calendar")}>
          <FiCalendar />
          <Link to="/calendar">Calendar</Link>
        </div>
        <div className={getMenuItemClass("/newRecipe")}>
          <FiPlusSquare />
          <Link to="/newRecipe">New Recipe</Link>
        </div>
      </div>
      <div className="space-y-4 mb-14 border-t-1">
        <div className={`flex items-center space-x-2 mt-2 ${getMenuItemClass("/profile")}`}>
          <FiUser />
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </div>
  );
};