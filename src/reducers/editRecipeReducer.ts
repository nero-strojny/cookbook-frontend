import {EditRecipeAction} from "./EditRecipeAction";
import {defaultRecipeState, EditRecipeState} from "./EditRecipeState";

export const editRecipeReducer = (state: EditRecipeState, action: EditRecipeAction): EditRecipeState => {
    const {payload} = action;
    const tempSteps = [...state.steps];
    const tempIngredients = [...state.ingredients];
    const tempTag = state.tags ? [...state.tags] : [];
    switch (action.type) {
        case "SET_RECIPE": {
            return {
                ...state,
                ...payload
            }
        }
        case "EDIT_NAME":
            return {
                ...state,
                recipeName: payload.recipeName || defaultRecipeState.recipeName
            };
        case "EDIT_AUTHOR":
            return {
                ...state,
                author: payload.author || defaultRecipeState.author
            };
        case "EDIT_CALORIES":
            return {
                ...state,
                calories: payload.calories || defaultRecipeState.calories
            };
        case "EDIT_COOK_TIME":
            return {
                ...state,
                cookTime: payload.cookTime || defaultRecipeState.cookTime
            };
        case "EDIT_PREP_TIME":
            return {
                ...state,
                prepTime: payload.prepTime || defaultRecipeState.prepTime
            };
        case "EDIT_SERVINGS":
            return {
                ...state,
                servings: payload.servings || defaultRecipeState.servings
            };
        case "ADD_STEP":
            return {
                ...state,
                steps: [...tempSteps, {number: tempSteps.length, text: ""}]
            };
        case "EDIT_STEP":
            tempSteps[payload.indexSelected || 0] = {
                ...tempSteps[payload.indexSelected || 0],
                text: payload.valueInput || ""
            };
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
            let tempTagArray: string[] = [];
            if (state.tags && payload.tag) {
                tempTagArray = [...state.tags, payload.tag];
            }
            return {
                ...state,
                tags: tempTagArray
            };
        case "DELETE_TAG":
            return {
                ...state,
                tags: tempTag.filter(tag => tag !== payload.tag)
            };
        case "CLEAR_RECIPE":
            return {
                ...defaultRecipeState
            }
        default:
            return state;
    }
};