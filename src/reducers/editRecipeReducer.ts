import { EditRecipeActionType } from "./EditRecipeActions";
import { EditRecipeState } from "./EditRecipeState";

export const editRecipeReducer = (state: EditRecipeState, action: EditRecipeActionType) => {
  const { payload } = action;
  const tempSteps = [...state.steps];
  const tempIngredients = [...state.ingredients];
  const tempTag = state.tags ? [...state.tags] : [];
  switch (action.type) {
    case "EDIT_NAME":
        return {
            ...state,
            recipeName: payload.recipeName
        };
    case "EDIT_AUTHOR":
        return {
            ...state,
            author: payload.author
        };
    case "EDIT_CALORIES":
        return {
            ...state,
            calories: payload.calories
        };
    case "EDIT_COOK_TIME":
        return {
            ...state,
            cookTime: payload.cookTime
        };
    case "EDIT_PREP_TIME":
        return {
            ...state,
            prepTime: payload.prepTime
        };
    case "EDIT_SERVINGS":
        return {
            ...state,
            servings: payload.servings
        };
    case "ADD_STEP":
        return {
            ...state,
            steps: [...tempSteps, ""]
        };
    case "EDIT_STEP":
        tempSteps[payload.indexSelected || 0] = payload.valueInput || "";
        return {
            ...state,
            steps: tempSteps
        };
    case "DELETE_STEP":
        tempSteps.splice(payload.indexSelected || 0, 1);
        return {
            ...state,
            steps: tempSteps
            };
    case "ADD_INGREDIENT":
        tempIngredients.push(payload.ingredient ||
          {name: "", category: "", amount: 0, measurement: "", _id: ""})
        return {
            ...state,
            ingredients: tempIngredients
        };
    case "DELETE_INGREDIENT":
        tempIngredients.splice(payload.indexSelected || 0, 1);
        return {
            ...state,
            ingredients: tempIngredients
        };
    case "ADD_TAG":
        return {
            ...state,
            tags: [...tempTag, payload.tag]
        };
    case "DELETE_TAG":
        return {
            ...state,
            tags: tempTag.filter(tag => tag !== payload.tag)
        };
    default:
        return state;
}
};