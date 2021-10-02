import React, { useState, useEffect, useContext } from "react";
import ViewRecipes from "./view/ViewRecipes";
import EditRecipe from "./edit/EditRecipe";
import "./stylesheets/index.css";
import MessageBar from "./MessageBar";
import Header from "./Header";
import { ServerRequestContext } from "./ServerRequestContext";
import Basket from "./basket/Basket";

function CookbookApp() {
  const [recipeToEdit, setRecipeToEdit] = useState({...defaultRecipe});
  const [width, setWidth] = useState(window.innerWidth);
  
  const { state, dispatch } = useContext(ServerRequestContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({type: 'CLEAR_MESSAGE'});
    }, 5000);
    return () => clearTimeout(timer);
  }, [dispatch, state]);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  function handleCreateRecipe() {
    defaultRecipe.ingredients = [];
    setRecipeToEdit({...defaultRecipe});
  }

  function returnPage(){
    switch(state.currentPage){
      case "viewRecipes": 
        return (<ViewRecipes
          onCreateRecipe={() => {
            dispatch({ type: 'SWITCH_TO_EDIT' });
            setRecipeToEdit(defaultRecipe);
          }}
          onEditRecipe={(recipe) => {
            dispatch({ type: 'SWITCH_TO_EDIT' });
            setRecipeToEdit(recipe);
          }}
          width={width}
        />);
      case "editRecipes": 
          return (
            <EditRecipe
              onSuccessfulCreate={handleCreateRecipe}
              inputtedRecipe={recipeToEdit}
            />);
      case "basket": 
          return (
            <Basket />
          );
      default:
        return( <ViewRecipes
          onCreateRecipe={() => {
            dispatch({ type: 'SWITCH_TO_EDIT' });
            setRecipeToEdit(defaultRecipe);
          }}
          onEditRecipe={(recipe) => {
            dispatch({ type: 'SWITCH_TO_EDIT' });
            setRecipeToEdit(recipe);
          }}
        />);
    }
  }

  return (
      <>
      <Header styleValue={"orangeMenuStyle"} width={width}/>
      <MessageBar />
      {returnPage()}
    </>
  );
}
export default CookbookApp;

export const defaultRecipe = {
  steps: [""],
  ingredients: [],
  recipename: "",
  servings: 0,
  author: "",
  cooktime: 0,
  preptime: 0,
  tags: []
};
