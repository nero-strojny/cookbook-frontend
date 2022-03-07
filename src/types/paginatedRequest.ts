import {QueryRecipe} from "./queryRecipe";

export type PaginatedRequest = {
  pageSize: number;
  pageCount: number;
  queryRecipe?: QueryRecipe;
}