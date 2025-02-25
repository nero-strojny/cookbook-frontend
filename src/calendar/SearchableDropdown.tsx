import React, { useState } from 'react';
import { Recipe } from '../types/Recipe';
import { useGetRecipes } from '../hooks/useGetRecipes';

interface SearchableDropdownType {
  handleSetRecipe:(recipe:Recipe)=>void
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

export const SearchableDropdown = (props:SearchableDropdownType) => {
  const {query, setQuery, handleSetRecipe} = props
  const [selectedItem, setSelectedItem] = useState<Recipe|null>(null);
  const { data, isLoading } = useGetRecipes(0, query, 5)
  const recipes = data?.recipes || []
  const recipeNames = recipes.map(recipe => recipe.recipeName)

  const handleInputChange = (e: React.FormEvent) => {
    setQuery((e.target as HTMLInputElement).value);
    setSelectedItem(null)
  };

  const handleSelect = (recipe:Recipe) => {
    setSelectedItem(recipe);
    setQuery(recipe.recipeName); 
    handleSetRecipe(recipe)
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
          className="w-full p-2 rounded-full bg-white border border-sandy"
        placeholder="Set a different recipe..."
      />
      {(recipes.length > 0 && query && selectedItem === null) && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          {isLoading && (
            <div className="text-center py-2 text-gray-500">Loading...</div>
          )}
          {!isLoading && recipeNames.length === 0 && (
            <div className="py-2 text-center text-gray-500">No results found</div>
          )}
          {!isLoading &&
            recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelect(recipe)}
              >
                {recipe.recipeName}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
