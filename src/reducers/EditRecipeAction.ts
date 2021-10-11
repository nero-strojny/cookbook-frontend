import { Ingredient } from "../types/ingredient";

export type EditRecipeAction = {
  type: string,
  payload: {
    recipeName?: string;
    author?: string;
    ingredient?: Ingredient;
    tag?: string;
    prepTime?: number;
    cookTime?: number;
    calories?: number;
    servings?: number;
    indexSelected?: number;
    valueInput?: string;
  }
 }