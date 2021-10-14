import { defaultPaginatedRequest } from "../serviceCalls";
import { PaginatedRequest } from "../types/paginatedRequest";
import { Recipe } from "../types/recipe";
import { defaultRecipe } from "./EditRecipeState";

export interface ServerState {
  accessToken: string;
  userName: string;
  paginatedRequest: PaginatedRequest;
  shouldRefresh: boolean;
  basket: Recipe[];
  recipes?: Recipe[];
  calendarRecipes?: Recipe[];
  numberOfRecipes?: number;
  header?: string;
  messageContent?: string;
}

export const initialServerState: ServerState = {
  accessToken: "",
  userName: "",
  paginatedRequest: defaultPaginatedRequest,
  shouldRefresh: true,
  basket: [],
  recipes: [],
  calendarRecipes: []
}