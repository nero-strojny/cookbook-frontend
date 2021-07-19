import axios from "axios";

let endpoint = "http://ec2-3-216-126-107.compute-1.amazonaws.com:8080";
//let endpoint = "http://localhost:8080";

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

export const getRecipes = async (paginatedRequest, token) =>{
  let response;
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

export const getRandomRecipes = async (token) =>{
  let response;
  try {
    response = await axios.get(endpoint + "/api/randomRecipe/5",
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

export const searchRecipe = async (recipeName, token) => {
  let response;
  try {
    response = await axios.post(endpoint + `/api/recipe/search`, {recipeName}, {
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
