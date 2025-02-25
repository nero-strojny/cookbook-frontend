import React, { ReactNode } from 'react';
import { AddToCartButton } from '../shared/AddToCartButton';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Recipe } from '../types/Recipe';
import { Spinner } from '../shared/Spinner';

interface RecipeCardProps {
  recipe: Recipe
  isLoading?: boolean
  children?: ReactNode
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe, children, isLoading
}) => {
  const {
    _id,
    recipeName,
    author,
    servings,
    prepTime,
    cookTime,
    ingredients,
    calories
  } = recipe;
  const { cart, addToCart, removeFromCart } = useCart();
  const added = cart.some((recipe) => recipe._id === _id);

  const handleOnClick = () => {
    if (added) {
      removeFromCart(_id);
    } else {
      addToCart(recipe);
    }
  }

  return (
    <div className="rounded overflow-visible shadow-lg bg-white p-4 flex flex-col justify-between">
      {children}
      {!ingredients ? <div className="text-gray-500">No recipe</div> :
      (isLoading ? <Spinner /> : <>
      <div className="flex-grow grid grid-cols-2 gap-4">
        <div>
          <Link to={`/recipe/${_id}`}>
            <div className="font-bold text-xl mb-2 hover:underline">{recipeName}</div>
          </Link>
          <p className="text-gray-500 text-sm">Author: {author}</p>
                  </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Calories: {calories}</p>
          <p className="text-gray-500 text-sm">Servings: {servings}</p>
          <p className="text-gray-500 text-sm">Total Time: {prepTime + cookTime}</p>
        </div>
      </div>
      <div className="mt-auto">
        <AddToCartButton added={added} onClick={()=>handleOnClick()} />
      </div>
    </>)}
    </div>
  );
};