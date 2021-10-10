import React, { useState, useContext, useReducer } from "react";
import { Form, Divider, Grid, Button, Card } from "semantic-ui-react";
import Steps from "./Steps";
import Tags from "./Tags";
import Ingredients from "./Ingredients";
import { createRecipe, updateRecipe } from "../serviceCalls";
import { ServerRequestContext } from "../ServerRequestContext";
import { RecipeContext } from "../RecipeContext";
import { editRecipeReducer } from "../reducers/editRecipeReducer";
import { Recipe } from "../types/recipe";
import { defaultRecipe } from "../reducers/EditRecipeState";

type EditRecipeProps = {
  onSuccessfulCreate: Function;
  inputtedRecipe: Recipe
}

function EditRecipe({onSuccessfulCreate, inputtedRecipe}: EditRecipeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  const [state, dispatch] = useReducer(editRecipeReducer, {
    ...defaultRecipe,
    ...inputtedRecipe
  });

  const submitRecipe = async () => {
    const submittedRecipe = {
      ...state,
      userName: serverState.userName,
    };

    setIsLoading(true);
    if (inputtedRecipe._id) {
      const response = await updateRecipe(inputtedRecipe._id, submittedRecipe, serverState.accessToken);
      if (response.status === 200) {
        serverDispatch({ type: 'EDIT_SUCCESS', payload: { recipeName: state.recipeName } });
      } else if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
      } else {
        serverDispatch({ type: 'EDIT_FAILURE', payload: {} });
      }
    } else {
      const response = await createRecipe(submittedRecipe, serverState.accessToken);
      if (response.status === 201) {
        serverDispatch({ type: 'CREATE_SUCCESS', payload: { recipeName: state.recipeName } });
        onSuccessfulCreate(state.recipeName);
      } else if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
      } else {
        serverDispatch({ type: 'CREATE_FAILURE', payload: {} });
      }
    }
  };

  return (
    <RecipeContext.Provider value={{state, dispatch}}>
      <Grid padded>
        <Grid.Row columns="equal">
          <Grid.Column>
            <h1> Edit Recipe</h1>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Button inverted color="orange" onClick={() => serverDispatch({ type: 'SWITCH_TO_RECIPES', payload: {} })}>
              Back to My Recipes
            </Button>
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
                            defaultValue={inputtedRecipe.recipeName}
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
                            defaultValue={inputtedRecipe.author}
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
                            type="number"
                            placeholder="kCal/serving"
                            defaultValue={inputtedRecipe.calories}
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
                            type="number"
                            defaultValue={inputtedRecipe.prepTime}
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
                            type="number"
                            defaultValue={inputtedRecipe.cookTime}
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
                            type="number"
                            defaultValue={inputtedRecipe.servings}
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
    </RecipeContext.Provider>
  );
}
export default EditRecipe;
