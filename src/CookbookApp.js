import React, { useState, useEffect, useReducer } from "react";
import ViewRecipes from "./view/ViewRecipes";
import EditRecipe from "./edit/EditRecipe";
import "./stylesheets/index.css";
import MessageBar from "./MessageBar";
import Header from "./Header";
import { MessageBarContext } from "./MessageBarContext";
import { messageReducer } from "./reducers/messageReducer";

function CookbookApp({ token, currentUser, setAccessToken }) {
  const [showEditPage, setShowEditPage] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState({...defaultRecipe});

  const [state, dispatch] = useReducer(messageReducer, {});

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({type: 'CLEAR_MESSAGE'})
    }, 5000);
    return () => clearTimeout(timer);
  }, [state]);

  function handleCreateRecipe() {
    defaultRecipe.ingredients = [{}];
    setRecipeToEdit({...defaultRecipe});
    setShowEditPage(false);
  }

  return (
    <MessageBarContext.Provider value={{state, dispatch}}>
      <Header styleValue={"orangeMenuStyle"} setAccessToken={setAccessToken}/>
      <MessageBar />
      {showEditPage ? (
        <EditRecipe
          token={token}
          currentUser={currentUser}
          onSuccessfulCreate={handleCreateRecipe}
          inputtedRecipe={recipeToEdit}
          setShowEditPage={setShowEditPage}
        />
      ) : (
          <ViewRecipes
            token={token}
            currentUser={currentUser}
            onCreateRecipe={() => {
              setShowEditPage(true);
              setRecipeToEdit(defaultRecipe);
            }}
            onEditRecipe={(recipe) => {
              setShowEditPage(true);
              setRecipeToEdit(recipe);
            }}
          />
        )}
    </MessageBarContext.Provider>
  );
}
export default CookbookApp;

export const defaultRecipe = {
  steps: [""],
  ingredients: [{name:"", amount:0, measurement: ""}],
  recipename: "",
  servings: 0,
  author: "",
  cooktime: 0,
  preptime: 0,
  tags: []
};
