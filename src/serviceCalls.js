import axios from "axios";
import { Promise } from "bluebird";
import { get, set, has } from 'lodash';

let endpoint = "http://ec2-3-216-126-107.compute-1.amazonaws.com:8080";
//let endpoint = "http://localhost:8080";

export const defaultPaginatedRequest = {
  pageSize: 5,
  pageCount: 0
}

export const login = async (username, password) => {
  return await axios.post(endpoint + "/api/userToken",
  {username, password}, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const createRecipe = async (recipe, token) => {
  let response;
  try {
    response = await axios.post(endpoint + "/api/recipe", recipe, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch(err) {
    response = err.response
  }
  return response
};

export const getRecipes = async (inputPaginatedRequest, token) =>{
  let response;
  const paginatedRequest = inputPaginatedRequest || defaultPaginatedRequest;
  try {
    response = await axios.post(endpoint + "/api/recipes", 
    paginatedRequest, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });
  } catch(err) {
    response = err.response
  }
  return response
};

export const getRandomRecipes = async (token, numberOfRecipes) =>{
  let response;
  try {
    response = await axios.get(endpoint + `/api/randomRecipe/${numberOfRecipes}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
  });
  } catch(err) {
    response = err.response
  }
  return response
};

export const updateRecipe = async (recipeId, recipe, token) => {
  await Promise.map(recipe.ingredients, async ingredient => {
    if(!has(ingredient, "category")){
      const ingredientResponse = await getIngredient(ingredient._id, token);
      if(has(ingredientResponse, "data.category")){
        set(ingredient, "category", get(ingredientResponse, "data.category"));
      }
    }
  });
  let response;
  try {
    response = await axios.put(endpoint + `/api/recipe/${recipeId}`, recipe, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch(err) {
    response = err.response
  }
  return response
};

const getIngredient = async (ingredientId, token) => {
  let response;
  try {
    response = await axios.get(endpoint + `/api/ingredient/${ingredientId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch(err) {
    response = err.response
  }
  return response
};

export const deleteRecipe = async (recipeId, token) => {
  let response;
  try {
    response = await axios.delete(endpoint + `/api/recipe/${recipeId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch(err) {
    response = err.response
  }
  return response
};

export const searchRecipe = async (recipe, token) => {
  let response;
  try {
    response = await axios.post(endpoint + `/api/recipe/search`, {...recipe}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
  } catch(err) {
    response = err.response
  }
  return response
}

export const createIngredient = async (ingredient, token) => {
  let response;
  try {
    response = await axios.post(endpoint + `/api/ingredient`, {...ingredient}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
  } catch(err) {
    response = err.response
  }
  return response
}

export const searchIngredient = async (prefix, token) => {
  let response;
  try {
    response = await axios.get(endpoint + `/api/ingredients?prefixIngredient=${prefix}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
  } catch(err) {
    response = err.response
  }
  return response
}


