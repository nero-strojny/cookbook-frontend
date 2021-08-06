export const recipeReducer = (state, action) => {
    const { payload } = action;
    const tempSteps = [...state.steps];
    const tempIngredients = [...state.ingredients];
    const tempTag = state.tags ? [...state.tags] : [];
    console.log(tempIngredients);
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
            tempSteps[payload.indexSelected] = payload.valueInput;
            return {
                ...state,
                steps: tempSteps
            };
        case "DELETE_STEP":
            tempSteps.splice(payload.indexSelected, 1);
            return {
                ...state,
                steps: tempSteps
                };
        case "ADD_INGREDIENT":
            return {
                ...state,
                ingredients: [...tempIngredients, {}]
            };
        case "EDIT_INGREDIENT":
            tempIngredients[payload.indexSelected][payload.keySelected] = payload.valueInput;
            return {
                ...state,
                ingredients: tempIngredients
            };
        case "DELETE_INGREDIENT":
            tempIngredients.splice(payload.indexSelected, 1);
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