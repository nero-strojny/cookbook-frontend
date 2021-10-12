import { defaultPaginatedRequest } from "../serviceCalls";
import { findIndex, get } from "lodash";
import { ServerState } from "./ServerState";
import { ServerAction } from "./ServerAction";
import { Recipe } from "../types/recipe";

export const serverRequestReducer = (state: ServerState, action: ServerAction): ServerState => {
  const { payload } = action;
  let tempBasket: Recipe[] = [];
  switch (action.type) {
    case "REFRESH_RECIPES":
      return {
        ...state,
        shouldRefresh: true,
        currentPage: "viewRecipes",
        basket: [],
      }
    case "ADD_BASKET":
      if (payload.basketItem){
        tempBasket = [...state.basket, payload.basketItem];
      }
      return {
        ...state,
        basket: tempBasket
      }
    case "ADD_ALL_BASKET":
      tempBasket = [...state.basket];
      const payloadBasketItems: Recipe[] = payload.basketItems || [];
      const dedup = payloadBasketItems.filter((addedBasketItem) => {
        const index = findIndex(state.basket, basketItem => addedBasketItem._id === basketItem._id);
        return index === -1;
      })
      return {
        ...state,
        basket: tempBasket.concat(dedup)
        }
    case "ADD_ALL_CALENDAR":
      return {
        ...state,
        calendarRecipes: payload.calendarRecipes,
        header: 'Success!',
        messageContent: `Your Calendar Has Been Saved For This Session!`,
        }
    case "REMOVE_BASKET":
      tempBasket = [...state.basket];
      const basketItemId: string = get(payload, "basketItem._id", "");
      const index = findIndex(state.basket, basketItem => basketItemId === basketItem._id);
      tempBasket.splice(index, 1);
      return {
        ...state,
        basket: tempBasket
      }
    case "EMPTY_BASKET":
      return {
        ...state,
        basket: []
      }
    case "SHOW_MESSAGE":
      return {
        ...state,
        header: payload.success ? "Success!": "Error",
        messageContent: payload.messageContent,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes"
      }
    case "CLEAR_MESSAGE":
      return {
        ...state, 
        header: undefined,
        messageContent: undefined
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        accessToken: payload.accessToken || "",
        userName: payload.userName || "",
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
        paginatedRequest: payload.paginatedRequest || defaultPaginatedRequest,
        shouldRefresh: true,
        currentPage: "viewRecipes",
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
    case "SWITCH_TO_PAGE":
      return {
        ...state,
        currentPage: payload.currentPage || "viewRecipes",
        shouldRefresh: true
      }
    case "EMAIL_SUCCESS":
      return {
        ...state,
        header: 'Success!',
        messageContent: 'Shopping list has been emailed!',
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: false,
        currentPage: "basket"
      }
    case "EMAIL_FAILURE":
      return {
        ...state,
        header: 'Error!',
        messageContent: 'Emailing shopping list failed due to an error',
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: false,
        currentPage: "basket"
      }
    default:
      return state;
  }
}