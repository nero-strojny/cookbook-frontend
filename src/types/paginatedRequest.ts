import { QueryRecipe } from "./queryRecipe";
import { Recipe } from "./recipe";

export type PaginatedRequest = {
  pageSize: number;
  pageCount: number;
  queryRecipe?: QueryRecipe;
}