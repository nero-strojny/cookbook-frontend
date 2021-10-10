import { Ingredient } from "../types/ingredient";

export interface EditRecipeState {
  recipeName: string;
  author: string;
  userName?: string;
  ingredients: Ingredient[];
  stepsText?: string[];
  tags: string[];
  prepTime: number;
  cookTime: number;
  calories: number;
  servings: number;
}

export const defaultRecipe: EditRecipeState = {
  stepsText: [],
  ingredients: [],
  recipeName: "",
  servings: 0,
  author: "",
  cookTime: 0,
  prepTime: 0,
  tags: [],
  calories: 0
};
