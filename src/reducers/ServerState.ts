import { defaultPaginatedRequest } from "../serviceCalls";
import { PaginatedRequest } from "../types/paginatedRequest";
import { Recipe } from "../types/recipe";

export interface ServerState {
  accessToken: string;
  userName: string;
  paginatedRequest: PaginatedRequest;
  shouldRefresh: boolean;
  currentPage: string;
  basket: Recipe[];
  recipes?: Recipe[];
  numberOfRecipes?: number;
  header?: string;
  messageContent?: string;
}

export const initialServerState: ServerState = {
  accessToken: "",
  userName: "",
  paginatedRequest: defaultPaginatedRequest,
  shouldRefresh: true,
  currentPage: "viewRecipes",
  basket: [],
  recipes: [],
}