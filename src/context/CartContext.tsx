import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Recipe } from '../types/Recipe';

interface CartContextProps {
  cart: Recipe[];
  addToCart: (recipe: Recipe) => void;
  addAllToCart: (recipes: Recipe[]) => void;
  removeFromCart: (recipeId: string) => void;
  removeAllFromCart: (recipeIds: string[]) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Recipe[]>([]);

  const addToCart = (recipe: Recipe) => {
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      setCart((prevCart) => [...prevCart, recipe])
    }
  };

  const addAllToCart = (recipes: Recipe[]) => {
    const additionalRecipes = recipes.filter(recipe => recipe.ingredients && recipe.ingredients.length > 0) 
    setCart((prevCart) => [...prevCart, ...additionalRecipes]);
  };

  const removeFromCart = (recipeId: string) => {
    setCart((prevCart) => prevCart.filter((recipe) => recipe._id !== recipeId));
  };

  const removeAllFromCart = (recipeIds: string[]) => {
    setCart((prevCart) => prevCart.filter((recipe) => !recipeIds.includes(recipe._id)));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeAllFromCart, addAllToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};