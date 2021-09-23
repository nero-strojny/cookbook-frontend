import React, { useState, useContext, useReducer } from "react";
import { Form, Divider, Grid, Button, Card } from "semantic-ui-react";
import Steps from "./Steps";
import Tags from "./Tags";
import Ingredients from "./Ingredients";
import { createRecipe, updateRecipe } from "../serviceCalls";
import { ServerRequestContext } from "../ServerRequestContext";
import { RecipeContext } from "../RecipeContext";
import { recipeReducer } from "../reducers/recipeReducer";

function EditRecipe({
  onSuccessfulCreate, 
  inputtedRecipe
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  const [state, dispatch] = useReducer(recipeReducer, {
    ...inputtedRecipe,
    steps: inputtedRecipe.steps.map(step => step.text)
  });

  const submitRecipe = async () => {
    let submittedSteps = state.steps
      .filter(step => step !== "")
      .map((step, index) => ({ number: index + 1, text: step }));
    if (!submittedSteps || !submittedSteps.length){
      submittedSteps = [""];
    }
    let submittedIngredients = state.ingredients
      .filter(ingredient =>
        ingredient.name !== "" ||
        ingredient.measurement !== "" ||
        ingredient.amount !== "");
    if (!submittedIngredients || !submittedIngredients.length){
      submittedIngredients = [""];
    }
    
    const submittedReport = {
      ...state,
      userName: serverState.userName,
      ingredients: submittedIngredients,
      steps: submittedSteps,
    };
    setIsLoading(true);
    if (inputtedRecipe._id) {
      const response = await updateRecipe(inputtedRecipe._id, submittedReport, serverState.accessToken);
      if (response.status === 200) {
        serverDispatch({ type: 'EDIT_SUCCESS', payload: { recipeName: state.recipeName } });
      } else if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS' });
      } else {
        serverDispatch({ type: 'EDIT_FAILURE' });
      }
    } else {
      const response = await createRecipe(submittedReport, serverState.accessToken);
      if (response.status === 201) {
        serverDispatch({ type: 'CREATE_SUCCESS', payload: { recipeName: state.recipeName } });
        onSuccessfulCreate(state.recipeName);
      } else if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS' });
      } else {
        serverDispatch({ type: 'CREATE_FAILURE' });
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
            <Button inverted color="orange" onClick={() => serverDispatch({ type: 'SWITCH_TO_RECIPES' })}>
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
                <Tags clickable />
                <Divider />
                <Ingredients />
                <Divider />
                <Steps />
              </Card.Content>
              <Card.Content extra>
                <Form.Button color='orange' loading={isLoading} onClick={() => submitRecipe()}>Submit</Form.Button>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </RecipeContext.Provider>
  );
}
export default EditRecipe;
