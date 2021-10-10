import { PaginatedRequest } from "../types/paginatedRequest";
import { Recipe } from "../types/recipe";

export enum ActionType {
  RefreshRecipes,
  AddBasket,
  AddAllBasket,
  RemoveBasket,
  EmptyBasket,
  CreateSuccess,
  EditSuccess,
  DeleteSuccess,
  CreateFailure,
  EditFailure,
  DeleteFailure,
  ClearMessage,
  LoginSuccess,
  LogoutSuccess,
  QueryRecipesPending,
  QueryRecipesSuccess,
  QueryRecipesFailed,
  SwitchToBasket,
  SwitchToRecipes,
  SwitchToEdit
}

export interface RefreshRecipes {
  type: ActionType.RefreshRecipes;
}

export interface AddBasket {
  type: ActionType.AddBasket;
  payload: {
    basketItem: Recipe;
  }
}

export interface AddAllBasket {
  type: ActionType.AddAllBasket;
  payload: {
    basketItems: Recipe;
  }
}

export interface RemoveBasket {
  type: ActionType.RemoveBasket;
  payload: {
    basketItem: Recipe;
  }
}

export interface EmptyBasket {
  type: ActionType.EmptyBasket;
}

export interface CreateSuccess {
  type: ActionType.CreateSuccess;
  payload: {
    recipeName: string;
  }
}

export interface EditSuccess {
  type: ActionType.EditSuccess;
  payload: {
    recipeName: string;
  }
}

export interface DeleteSuccess {
  type: ActionType.DeleteSuccess;
  payload: {
    recipeName: string;
  }
}

export interface CreateFailure {
  type: ActionType.CreateFailure;
}

export interface EditFailure {
  type: ActionType.EditFailure;
}

export interface DeleteFailure {
  type: ActionType.DeleteFailure;
}

export interface ClearMessage {
  type: ActionType.ClearMessage;
}

export interface LoginSuccess {
  type: ActionType.LoginSuccess;
  payload: {
    accessToken: string;
    userName: string;
  }
}

export interface LogoutSuccess {
  type: ActionType.LogoutSuccess;
}

export interface QueryRecipesPending {
  type: ActionType.QueryRecipesPending;
  payload: {
    paginatedRequest: PaginatedRequest;
  }
}

export interface QueryRecipesSuccess {
  type: ActionType.QueryRecipesSuccess;
  payload: {
    recipes: Recipe[],
    numberOfRecipes: number;
  }
}

export interface QueryRecipesFailed {
  type: ActionType.QueryRecipesFailed;
}

export interface SwitchToBasket {
  type: ActionType.SwitchToBasket;
}

export interface SwitchToRecipes {
  type: ActionType.SwitchToRecipes;
}

export interface SwitchToEdit {
  type: ActionType.SwitchToEdit;
}

export type ServerActions = 
  RefreshRecipes |
  AddBasket |
  AddAllBasket |
  RemoveBasket |
  EmptyBasket |
  CreateSuccess |
  EditSuccess |
  DeleteSuccess |
  CreateFailure |
  EditFailure |
  DeleteFailure |
  ClearMessage |
  LoginSuccess |
  LogoutSuccess |
  QueryRecipesPending |
  QueryRecipesSuccess |
  QueryRecipesFailed |
  SwitchToBasket |
  SwitchToRecipes |
  SwitchToEdit;