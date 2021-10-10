import { Ingredient } from "../types/ingredient";
import { Step } from "../types/step";

export interface EditRecipeState {
  recipeName: string;
  author: string;
  userName?: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  prepTime: number;
  cookTime: number;
  calories: number;
  servings: number;
}

export const defaultRecipe: EditRecipeState = {
  steps: [{number: 1, text: ""}],
  ingredients: [],
  recipeName: "",
  servings: 0,
  author: "",
  cookTime: 0,
  prepTime: 0,
  tags: [],
  calories: 0
};
