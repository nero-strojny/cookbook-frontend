import { Ingredient } from "./ingredient";
import { Step } from "./step";

export type Recipe = {
  _id: string;
  recipeName: string;
  author: string;
  userName: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  lastUpdatedDate: string;
  prepTime: number;
  cookTime: number;
  calories?: number;
  servings: number;
}