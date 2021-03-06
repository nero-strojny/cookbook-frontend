import React, { useState, useContext } from "react";
import { Form, Divider, Grid, Button, Card } from "semantic-ui-react";
import Steps from "./Steps";
import Ingredients from "./Ingredients";
import { createRecipe, updateRecipe } from "../serviceCalls";
import { MessageBarContext } from "../MessageBarContext";

function EditRecipe({ 
  token, 
  currentUser,
  onSuccessfulCreate, 
  inputtedRecipe,
  setShowEditPage 
}) {
  const [recipeName, setRecipeName] = useState(inputtedRecipe.recipeName);
  const [author, setAuthor] = useState(inputtedRecipe.author);
  const [calories, setCalories] = useState(inputtedRecipe.calories);
  const [steps, setSteps] = useState(inputtedRecipe.steps.map(step => step.text));
  const [ingredients, setIngredients] = useState(inputtedRecipe.ingredients);
  const [cookTime, setCookTime] = useState(inputtedRecipe.cookTime);
  const [prepTime, setPrepTime] = useState(inputtedRecipe.prepTime);
  const [servings, setServings] = useState(inputtedRecipe.servings);
  const [isLoading, setIsLoading] = useState(false);
  
  const { dispatch } = useContext(MessageBarContext);

  const submitRecipe = async () => {
    const submittedSteps = [];
    for (let i = 0; i < steps.length; i++) {
      if (steps[i] !== "") {
        submittedSteps.push({ number: i + 1, text: steps[i] });
      }
    }
    const submittedIngredients = [];
    for (let i = 0; i < ingredients.length; i++) {
      if (
        ingredients[i].name !== "" ||
        ingredients[i].measurement !== "" ||
        ingredients[i].amount !== ""
      ) {
        submittedIngredients.push(ingredients[i]);
      }
    }
    const submittedReport = {
      ...inputtedRecipe,
      recipeName,
      userName: currentUser,
      author,
      calories,
      cookTime,
      prepTime,
      servings,
      ingredients: submittedIngredients,
      steps: submittedSteps,
    };
    setIsLoading(true);
    if (inputtedRecipe._id) {
      const response = await updateRecipe(inputtedRecipe._id, submittedReport, token);
      if (response.status === 200) {
        dispatch({ type: 'EDIT_SUCCESS', payload: { recipeName } });
        setShowEditPage(false);
      } else {
        dispatch({ type: 'EDIT_FAILURE' });
        setShowEditPage(false);
      }
    } else {
      const response = await createRecipe(submittedReport, token);
      if (response.status === 201) {
        dispatch({ type: 'CREATE_SUCCESS', payload: { recipeName } });
        onSuccessfulCreate(recipeName);
      } else {
        dispatch({ type: 'CREATE_FAILURE' });
        setShowEditPage(false);
      }
    }
  };

  const removeIngredient = (ingredientIndex) => {
    const tempArray = [...ingredients];
    tempArray.splice(ingredientIndex, 1);
    setIngredients(tempArray);
  }

  const removeStep = (stepIndex) => {
    const tempArray = [...steps];
    tempArray.splice(stepIndex, 1);
    setSteps(tempArray);
  }

  return (
    <Grid padded>
      <Grid.Row columns="equal">
        <Grid.Column>
          <h1> Edit Recipe</h1>
        </Grid.Column>
        <Grid.Column textAlign="right">
          <Button inverted color="orange" onClick={() => setShowEditPage(false)}>
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
                          defaultValue={recipeName}
                          onChange={(event) =>
                            setRecipeName(event.target.value)
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
                          defaultValue={author}
                          onChange={(event) => setAuthor(event.target.value)}
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field>
                        <label>Calories Per Serving</label>
                        <input
                          type="number"
                          placeholder="kCal/serving"
                          defaultValue={calories}
                          onChange={(event) => setCalories(Number(event.target.value))}
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
                          defaultValue={prepTime}
                          onChange={(event) =>
                            setPrepTime(Number(event.target.value))
                          }
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field>
                        <label>Cook Time (min)</label>
                        <input
                          type="number"
                          defaultValue={cookTime}
                          onChange={(event) =>
                            setCookTime(Number(event.target.value))
                          }
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field>
                        <label>Servings</label>
                        <input
                          type="number"
                          defaultValue={servings}
                          onChange={(event) =>
                            setServings(Number(event.target.value))
                          }
                        />
                      </Form.Field>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
              <Divider />
              <Ingredients
                currentIngredients={ingredients}
                setCurrentIngredients={setIngredients}
                onIngredientDelete={(ingredientIndex) => removeIngredient(ingredientIndex)}
              />
              <Divider />
              <Steps
                currentSteps={steps}
                setCurrentSteps={setSteps}
                onStepDelete={(stepIndex) => removeStep(stepIndex)}
              />
            </Card.Content>
            <Card.Content extra>
              <Form.Button color='orange' loading={isLoading} onClick={() => submitRecipe()}>Submit</Form.Button>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
export default EditRecipe;
