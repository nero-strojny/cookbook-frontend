import axios, {AxiosResponse} from "axios";
import {Promise} from "bluebird";
import {get, has, set} from 'lodash';
import {NewIngredient} from "./types/ingredient";
import {PaginatedRequest} from "./types/paginatedRequest";
import {Recipe} from "./types/recipe";

// let process.env.REACT_APP_SERVER_BASE_URL = "http://localhost:8080";

export const defaultPaginatedRequest: PaginatedRequest = {
    pageSize: 6,
    pageCount: 0
}

export const login = async (username: string, password: string) => {
    return await axios.post(process.env.REACT_APP_SERVER_BASE_URL + "/api/userToken",
        {username, password}, {
            headers: {
                "Content-Type": "application/json",
            },
        });
}

export const signup = async (username: string, password: string, email: string, agree: boolean) => {
    return await axios.post(process.env.REACT_APP_SERVER_BASE_URL + "/api/user",
        {username, password, email, agreedToTerms: agree}, {
            headers: {
                "Content-Type": "application/json",
            }
        })
}

export const updatePassword = async (userName: string, currentPassword: string, newPassword: string) => {
    return await axios.put(process.env.REACT_APP_SERVER_BASE_URL + "/api/user",
        {username: userName, currentPassword, newPassword}, {
            headers: {
                "Content-Type": "application/json",
            }
        })
}

export const createRecipe = async (recipe: Recipe, token: string) => {
    let response: AxiosResponse;
    try {
        response = await axios.post(process.env.REACT_APP_SERVER_BASE_URL + "/api/recipe", recipe, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
};

export const getRecipes = async (inputPaginatedRequest: PaginatedRequest, token: string): Promise<AxiosResponse> => {
    let response;
    const paginatedRequest = inputPaginatedRequest || defaultPaginatedRequest;
    try {
        response = await axios.post(process.env.REACT_APP_SERVER_BASE_URL + "/api/recipes",
            paginatedRequest, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
};

export const getRecipe = async (recipeId: string, token: string): Promise<AxiosResponse> => {
    let response;
    try {
        response = await axios.get(process.env.REACT_APP_SERVER_BASE_URL + `/api/recipe/${recipeId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
};

export const getRandomRecipes = async (token: string, numberOfRecipes: number): Promise<AxiosResponse> => {
    let response;
    try {
        response = await axios.get(process.env.REACT_APP_SERVER_BASE_URL + `/api/randomRecipe/${numberOfRecipes}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
    } catch (err) {
        response = get(err, 'response');
    }
    return response;
};

export const updateRecipe = async (recipeId: string, recipe: Recipe, token: string): Promise<AxiosResponse> => {
    await Promise.map(recipe.ingredients, async ingredient => {
        const ingredientResponse = await getIngredient(ingredient._id, token);
        if (has(ingredientResponse, "data.category")) {
            set(ingredient, "category", get(ingredientResponse, "data.category"));
        }
    });
    let response;
    try {
        response = await axios.put(process.env.REACT_APP_SERVER_BASE_URL + `/api/recipe/${recipeId}`, recipe, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
};

const getIngredient = async (ingredientId: string, token: string): Promise<AxiosResponse> => {
    let response;
    try {
        response = await axios.get(process.env.REACT_APP_SERVER_BASE_URL + `/api/ingredient/${ingredientId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
};

export const deleteRecipe = async (recipeId: string, token: string): Promise<AxiosResponse> => {
    let response;
    try {
        response = await axios.delete(process.env.REACT_APP_SERVER_BASE_URL + `/api/recipe/${recipeId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
};

export const createIngredient = async (ingredient: NewIngredient, token: string): Promise<AxiosResponse> => {
    let response;
    try {
        response = await axios.post(process.env.REACT_APP_SERVER_BASE_URL + `/api/ingredient`, {...ingredient}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
}

export const searchIngredient = async (prefix: string, token: string): Promise<AxiosResponse> => {
    let response;
    try {
        response = await axios.get(process.env.REACT_APP_SERVER_BASE_URL + `/api/ingredients?prefixIngredient=${prefix}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
}

export const emailBasket = async (ingredientStrings: { [category: string]: string[] }, token: string) => {
    let response;
    try {
        response = await axios.post(process.env.REACT_APP_SERVER_BASE_URL + `/api/basket`, ingredientStrings, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    } catch (err) {
        response = get(err, 'response');
    }
    return response
}


