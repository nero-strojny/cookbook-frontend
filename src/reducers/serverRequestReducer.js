import { defaultPaginatedRequest } from "../serviceCalls";

export const serverRequestReducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "CREATE_SUCCESS":
      return {
        ...state,
        header: 'Success!',
        messageContent: `Recipe, "${payload.recipeName}", has been created`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true
      }
    case "EDIT_SUCCESS":
      return {
        ...state,
        header: 'Success!',
        messageContent: `Recipe, "${payload.recipeName}", has been edited`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true
      }
    case "DELETE_SUCCESS":
      return {
        ...state,
        header: 'Success!',
        messageContent: `Recipe, "${payload.recipeName}", has been deleted`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true
      }
    case "CREATE_FAILURE":
      return {
        ...state,
        header: 'Error',
        messageContent: `There was an error in creating a new recipe`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true
      }
    case "EDIT_FAILURE":
      return {
        ...state,
        header: 'Error',
        messageContent: `There was an error in editing a new recipe`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true
      }
    case "DELETE_FAILURE":
      return {
        ...state,
        header: 'Error!',
        messageContent: `There was an error in deleting a new recipe`,
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: true
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
        shouldRefresh: true
      }
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        accessToken: "",
        userName: "",
        paginatedRequest: defaultPaginatedRequest,
        shouldRefresh: false,
        recipes: [],
        numberOfRecipes: 1
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
    default:
      return state;
  }
}