import { FiCalendar, FiHome, FiPlusSquare } from "react-icons/fi";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartIcon } from "../shared/CartIcon";

export const MobileMenu = () => {
  const { cart } = useCart()
  const location = useLocation();
  const currentRoute = location.pathname;

  const activeMenuItemClass = "border-t-1 border-rust p-2 text-rust";
  const menuItemClass = "p-2 text-sandy";
  
  function getMenuItemClass(path: string) {
    return currentRoute === path ? activeMenuItemClass : menuItemClass;
  }
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white flex justify-around items-start border-t-1 border-sandy pb-3">
      <Link to="/" className={getMenuItemClass("/")}>
        <FiHome size={32} />
      </Link>
      <Link to="/cart" className={getMenuItemClass("/cart")}>
        <CartIcon itemCount={cart.length} />
      </Link>
      <Link to="/newRecipe" className={getMenuItemClass("/newRecipe")}>
        <FiPlusSquare size={32} />
      </Link>
      <Link to="/calendar" className={getMenuItemClass("/calendar")}>
        <FiCalendar size={32} />
      </Link>
    </div>
  );
};