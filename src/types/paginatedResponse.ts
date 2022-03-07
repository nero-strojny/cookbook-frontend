import {Recipe} from "./recipe";

export type PaginatedResponse = {
  recipes: Recipe[];
  numberOfRecipes: number;
  pageCount: number;
  pageSize: number;
}