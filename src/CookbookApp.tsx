import React, { useState, useEffect, useContext } from "react";
import ViewRecipes from "./view/ViewRecipes";
import EditRecipe from "./edit/EditRecipe";
import "./stylesheets/index.css";
import MessageBar from "./MessageBar";
import Header from "./Header";
import { ServerRequestContext } from "./ServerRequestContext";
import Basket from "./basket/Basket";
import { defaultRecipe } from "./reducers/EditRecipeState"
import { Recipe } from "./types/recipe";

function CookbookApp(): JSX.Element {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const { state, dispatch } = useContext(ServerRequestContext);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe>({...defaultRecipe, userName: state.userName });

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({type: 'CLEAR_MESSAGE', payload: {}});
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
    setRecipeToEdit({...defaultRecipe, userName: state.userName });
  }

  function returnPage(){
    switch(state.currentPage){
      case "viewRecipes": 
        return (<ViewRecipes
          onCreateRecipe={() => {
            dispatch({ type: 'SWITCH_TO_EDIT', payload: {} });
            setRecipeToEdit({...defaultRecipe, userName: state.userName });
          }}
          onEditRecipe={(recipe: React.SetStateAction<Recipe>) => {
            dispatch({ type: 'SWITCH_TO_EDIT', payload: {} });
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
            dispatch({ type: 'SWITCH_TO_EDIT', payload: {} });
            setRecipeToEdit({...defaultRecipe, userName: state.userName });
          }}
          onEditRecipe={(recipe: React.SetStateAction<Recipe>) => {
            dispatch({ type: 'SWITCH_TO_EDIT', payload: {} });
            setRecipeToEdit(recipe);
          }}
          width={width}
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
