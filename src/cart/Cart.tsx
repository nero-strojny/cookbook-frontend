import { isMobileOnly } from "react-device-detect";
import { PageHeader } from "../shared/PageHeader";
import { useCart } from "../context/CartContext";
import IngredientsList from "./IngredientsList";
import { IngredientTable } from "./IngredientTable";
import { useState } from "react";
import { FiDelete } from "react-icons/fi";

export const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const [activeTab, setActiveTab] = useState('recipes');
  return (
    <div className={`p-4 ${isMobileOnly ? 'my-14' : 'ml-42 mt-10'}` }>
      <PageHeader title="Cart"/>
      <div>
      { cart.length === 0 ? <div className="text-gray-500">Cart is empty</div> :
      <div className="py-2 max-w-4xl mx-auto p-4 mt-2 bg-white rounded-lg shadow-md overflow-scroll">
          <div className="flex mb-4">
            <button
              className={`px-4 py-2 cursor-pointer ${activeTab === 'recipes' ? 'text-rust border-b-2 border-rust font-bold' : 'text-black'}`}
              onClick={() => setActiveTab('recipes')}
            >
              Recipes
            </button>
            <button
              className={`px-4 py-2 cursor-pointer ${activeTab === 'ingredients' ? 'text-rust border-b-2 border-rust font-bold' : 'text-black'}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
          </div>
          {activeTab === 'recipes' && 
            <div className={`my-4 flex flex-col ${!isMobileOnly && 'w-1/2 mx-auto'}`}>
                {cart.map((recipe) => (
                  <div
                    className="flex justify-between mx-auto gap-2 w-full border-b border-gray-300"
                    key={recipe._id}>
                    <span className="text-lg">{recipe.recipeName}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={()=>removeFromCart(recipe._id)}
                        className="hover:text-sandy text-rust cursor-pointer" type='button'>
                        <FiDelete size={28} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          }
          {activeTab === 'ingredients' &&   
            (isMobileOnly ? 
              <IngredientsList cart={cart} /> :
              <IngredientTable cart={cart} />
            )
          }
        </div>}
      </div>
    </div>
  );
}
