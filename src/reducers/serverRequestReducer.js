import { defaultPaginatedRequest } from "../serviceCalls";
import { findIndex } from "lodash";

export const serverRequestReducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "REFRESH_RECIPES":
      return {
        ...state,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "ADD_BASKET":
      const tempBasket = [...state.basket];
      return {
        ...state,
        basket: [...tempBasket, payload.basketItem]
      }
    case "REMOVE_BASKET":
      const currentBasket = [...state.basket];
      const index = findIndex(state.basket, basketItem => payload.basketItem._id === basketItem._id);
      currentBasket.splice(index, 1);
      return {
        ...state,
        basket: currentBasket
      }
    case "CREATE_SUCCESS":
      return {
        ...state,
        header: 'Success!',
        messageContent: `Recipe, "${payload.recipeName}", has been created`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "EDIT_SUCCESS":
      return {
        ...state,
        header: 'Success!',
        messageContent: `Recipe, "${payload.recipeName}", has been edited`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "DELETE_SUCCESS":
      return {
        ...state,
        header: 'Success!',
        messageContent: `Recipe, "${payload.recipeName}", has been deleted`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "CREATE_FAILURE":
      return {
        ...state,
        header: 'Error',
        messageContent: `There was an error in creating a new recipe`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "EDIT_FAILURE":
      return {
        ...state,
        header: 'Error',
        messageContent: `There was an error in editing a new recipe`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "DELETE_FAILURE":
      return {
        ...state,
        header: 'Error!',
        messageContent: `There was an error in deleting a new recipe`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "CLEAR_MESSAGE":
      return {
        ...state, 
        header: null,
        messageContent: null
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        accessToken: payload.accessToken,
        userName: payload.userName,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes",
        basket: [],
      }
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        accessToken: "",
        userName: "",
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: false,
        currentPage: "viewRecipes",
        recipes: [],
        numberOfRecipes: 1,
        basket: []
      }
    case "QUERY_RECIPES_PENDING":
      return {
        ...state, 
        paginatedRequest: payload.paginatedRequest,
        shouldRefresh: true
      }
    case "QUERY_RECIPES_SUCCESS":
      return {
        ...state,
        shouldRefresh: false,
        recipes: payload.recipes,
        numberOfRecipes: payload.numberOfRecipes
      }
    case "QUERY_RECIPES_FAILED":
      return {
        ...state,
        shouldRefresh: false,
        recipes: [],
        numberOfRecipes: 1
      }
    case "SWITCH_TO_BASKET":
      return {
        ...state,
        currentPage: "basket",
      }
    case "SWITCH_TO_RECIPES":
      return {
        ...state,
        currentPage: "viewRecipes",
        shouldRefresh: true
      }
    case "SWITCH_TO_EDIT":
      return {
        ...state,
        currentPage: "editRecipes"
      }
    default:
      return state;
  }
}