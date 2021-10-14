import React, { useState, useContext, useReducer, useEffect } from "react";
import { Form, Divider, Grid, Card } from "semantic-ui-react";
import Steps from "./Steps";
import Tags from "./Tags";
import Ingredients from "./Ingredients";
import { createRecipe, getRecipe, updateRecipe } from "../serviceCalls";
import { ServerRequestContext } from "../context/ServerRequestContext";
import { RecipeContext } from "../context/RecipeContext";
import { editRecipeReducer } from "../reducers/editRecipeReducer";
import { Recipe } from "../types/recipe";
import { defaultRecipe, defaultRecipeState } from "../reducers/EditRecipeState";
import { useHistory } from "react-router-dom";

const EditRecipe = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingRecipe, setLoadingRecipe] = useState<boolean>(true);
  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  const [state, dispatch] = useReducer(editRecipeReducer, defaultRecipeState);
  const history = useHistory();
  const currentPath = history.location.pathname;

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent) {
        if (currentPath.includes("editRecipes")) {
          const recipeId = currentPath.substring(currentPath.lastIndexOf('/') + 1);
          if(recipeId === "editRecipes") {
            dispatch({type: "SET_RECIPE", payload: {...defaultRecipe}});
          } else {
            setLoadingRecipe(true);
            const response = await getRecipe(recipeId, serverState.accessToken);
            if (response.status === 200) {
              dispatch({type: "SET_RECIPE", payload: {...response.data}});
            } else if (response.status === 401 || response.status === 403) {
              serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
            } else {
              serverDispatch({ type: 'SHOW_MESSAGE',
                payload: { messageContent: `There was an error retrieving the recipe`, success: false }
              });
              history.push("/viewRecipes");
            }
          }
          setLoadingRecipe(false);
        }
      }
    })();
    return () => {
      isCurrent = false
    }
  }, [currentPath, history, serverDispatch, serverState.accessToken]);

  
  const submitRecipe = async () => {
    const submittedRecipe: Recipe = {
      ...state,
      userName: serverState.userName,
    };

    setIsLoading(true);
    if (state._id) {
      const response = await updateRecipe(state._id, submittedRecipe, serverState.accessToken);
      if (response.status === 200) {
        serverDispatch({ type: 'SHOW_MESSAGE',
          payload: { messageContent: `Recipe, "${state.recipeName}", has been edited`, success: true }
        });
        history.push('/viewRecipes');
      } else if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
      } else {
        serverDispatch({ type: 'SHOW_MESSAGE',
          payload: { messageContent: `There was an error in editing the recipe`, success: false }
        });
      }
    } else {
      const response = await createRecipe(submittedRecipe, serverState.accessToken);
      if (response.status === 201) {
        serverDispatch({ type: 'SHOW_MESSAGE',
          payload: { messageContent: `Recipe, "${state.recipeName}", has been created`, success: true }
        });
        history.push('/viewRecipes');
      } else if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
      } else {
        serverDispatch({ type: 'SHOW_MESSAGE',
          payload: { messageContent: `There was an error in creating a new recipe`, success: false }
        });
      }
    }
  };

  return (
    <RecipeContext.Provider value={{state, dispatch}}>
      {!loadingRecipe && 
      <Grid padded>
        <Grid.Row columns="equal">
          <Grid.Column>
            <h1> Edit Recipe</h1>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card fluid>
              <Card.Content>
                <Form>
                  <Grid>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        <h3>Basics</h3>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        <Form.Field>
                          <label>Recipe Name</label>
                          <input
                            placeholder="Recipe Name"
                            value={state.recipeName}
                            onChange={(event) =>
                              dispatch({ type: 'EDIT_NAME', payload: { recipeName: event.target.value } })
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        <Form.Field>
                          <label>Author</label>
                          <input
                            placeholder="Author"
                            value={state.author}
                            onChange={(event) =>
                              dispatch({ type: 'EDIT_AUTHOR', payload: { author: event.target.value } })
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <Form.Field>
                          <label>Calories Per Serving</label>
                          <input
                            placeholder="kCal/serving"
                            value={state.calories}
                            onChange={(event) =>
                              dispatch({ type: 'EDIT_CALORIES', payload: { calories: Number(event.target.value) } })
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="equal">
                      <Grid.Column>
                        <Form.Field>
                          <label>Prep Time (min)</label>
                          <input
                            value={state.prepTime}
                            onChange={(event) =>
                              dispatch({ type: 'EDIT_PREP_TIME', payload: { prepTime: Number(event.target.value) } })
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <Form.Field>
                          <label>Cook Time (min)</label>
                          <input
                            value={state.cookTime}
                            onChange={(event) =>
                              dispatch({ type: 'EDIT_COOK_TIME', payload: { cookTime: Number(event.target.value) } })
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                      <Grid.Column>
                        <Form.Field>
                          <label>Servings</label>
                          <input
                            value={state.servings}
                            onChange={(event) =>
                              dispatch({ type: 'EDIT_SERVINGS', payload: { servings: Number(event.target.value) } })
                            }
                          />
                        </Form.Field>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form>
                <Divider />
                <Tags />
                <Divider />
                <Ingredients />
                <Divider />
                <Steps />
              </Card.Content>
              <Card.Content extra>
                <Form.Button 
                  color='orange'
                  disabled={state.ingredients.length <= 0}
                  loading={isLoading} onClick={() => submitRecipe()}>
                    Submit
                </Form.Button>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      }
      </RecipeContext.Provider>
  );
}
export default EditRecipe;
