import {PaginatedRequest} from "../types/paginatedRequest";
import {Recipe} from "../types/recipe";

export type ServerAction = {
  type: string,
  payload: {
    success?: boolean;
    messageContent?: string;
    basketItem?: Recipe;
    basketItems?: Recipe[];
    recipeName?: string;
    accessToken?: string;
    userName?: string;
    recipes?: Recipe[];
    calendarRecipes?: Recipe[];
    numberOfRecipes?: number;
    paginatedRequest?: PaginatedRequest;
  }
}