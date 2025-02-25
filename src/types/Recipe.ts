export interface Ingredient {
  _id: string;
  name: string;
  amount?: number;
  measurement?: string;
  category: string;
}

export interface Step {
  number: number;
  text: string;
}

export interface Recipe {
  _id: string;
  recipeName: string;
  lastUpdatedDate: string;
  ingredients: Ingredient[];
  author: string;
  prepTime: number;
  cookTime: number;
  steps: Step[];
  tags: string[];
  servings: number;
  calories: number;
  userName: string;
}

export interface RecipeResponse {
  recipes: Recipe[];
  pageSize: number;
  numberOfRecipes: number;
}