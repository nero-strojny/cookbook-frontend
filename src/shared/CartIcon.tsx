import { FiShoppingCart } from "react-icons/fi";

export const CartIcon = ({ itemCount }:{ itemCount:number }) => {
  return (
    <div className="relative inline-block">
      <FiShoppingCart size={32} />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 bg-rust text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </div>
  );
};
