import React, { useState, useEffect, useContext } from "react";
import ViewRecipes from "./view/ViewRecipes";
import EditRecipe from "./edit/EditRecipe";
import "./stylesheets/index.css";
import MessageBar from "./MessageBar";
import Header from "./Header";
import { ServerRequestContext } from "./ServerRequestContext";

function CookbookApp() {
  const [showEditPage, setShowEditPage] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState({...defaultRecipe});
  
  const { state, dispatch } = useContext(ServerRequestContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({type: 'CLEAR_MESSAGE'})
    }, 5000);
    return () => clearTimeout(timer);
  }, [dispatch, state]);

  function handleCreateRecipe() {
    defaultRecipe.ingredients = [{}];
    setRecipeToEdit({...defaultRecipe});
    setShowEditPage(false);
  }

  return (
      <>
      <Header styleValue={"orangeMenuStyle"} />
      <MessageBar />
      {showEditPage ? (
        <EditRecipe
          onSuccessfulCreate={handleCreateRecipe}
          inputtedRecipe={recipeToEdit}
          setShowEditPage={setShowEditPage}
        />
      ) : (
          <ViewRecipes
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
    </>
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
