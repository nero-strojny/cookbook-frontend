import React, { useContext } from "react";
import { Form, Grid, Button, Icon } from "semantic-ui-react";
import { RecipeContext } from "../RecipeContext";

function Ingredients() {
  const { state, dispatch } = useContext(RecipeContext);
  const { ingredients: currentIngredients } = state;

  function createIngredients() {
    let ingredientInputs = [
      <Grid.Row columns="equal" key="ingredient1">
        <Grid.Column width={4}>
          <Form.Field>
            <label>Amount</label>
            <input
              type="number"
              defaultValue={
                currentIngredients.length >= 1
                  ? currentIngredients[0].amount
                  : ""
              }
              onChange={(event) =>
                dispatch({ 
                  type: 'EDIT_INGREDIENT',
                  payload: {
                    indexSelected: 0,
                    keySelected: "amount",
                    valueInput: parseFloat(event.target.value)
                  }
                })
              }
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={4}>
          <Form.Field>
            <label>Measurement</label>
            <input
              defaultValue={
                currentIngredients.length >= 1
                  ? currentIngredients[0].measurement
                  : ""
              }
              onChange={(event) =>
                dispatch({ 
                  type: 'EDIT_INGREDIENT',
                  payload: {
                    indexSelected: 0,
                    keySelected: "measurement",
                    valueInput: event.target.value
                  }
                })
              }
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column width={6}>
          <Form.Field>
            <label>Name</label>
            <input
              defaultValue={
                currentIngredients.length >= 1 ? currentIngredients[0].name : ""
              }
              onChange={(event) =>
                dispatch({ 
                  type: 'EDIT_INGREDIENT',
                  payload: {
                    indexSelected: 0,
                    keySelected: "name",
                    valueInput: event.target.value
                  }
                })
              }
            />
          </Form.Field>
        </Grid.Column>
      </Grid.Row>,
    ];

    for (let i = 1; i < currentIngredients.length; i++) {
      ingredientInputs.push(
        <Grid.Row columns="equal" key={"ingredients" + i}>
          <Grid.Column width={4}>
            <Form.Field>
              <input
                type="number"
                value={currentIngredients[i].amount || 0}
                onChange={(event) =>
                  dispatch({ 
                    type: 'EDIT_INGREDIENT',
                    payload: {
                      indexSelected: i,
                      keySelected: "amount",
                      valueInput: parseFloat(event.target.value)
                    }
                  })
                }
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Field>
              <input
                value={currentIngredients[i].measurement || ''}
                onChange={(event) =>
                  dispatch({ 
                    type: 'EDIT_INGREDIENT',
                    payload: {
                      indexSelected: i,
                      keySelected: "measurement",
                      valueInput: event.target.value
                    }
                  })
                }
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={6}>
            <Form.Field>
              <input
                value={currentIngredients[i].name || ''}
                onChange={(event) =>
                  dispatch({ 
                    type: 'EDIT_INGREDIENT',
                    payload: {
                      indexSelected: i,
                      keySelected: "name",
                      valueInput: event.target.value
                    }
                  })
                }
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            <Icon 
              name="minus circle"
              size='big'
              color='grey'
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch({ 
                type: 'DELETE_INGREDIENT',
                payload: { indexSelected: i }
              })}
            />
          </Grid.Column>
        </Grid.Row>
      );
    }
    return ingredientInputs;
  }

  return (
    <Form>
      <Grid>
        <Grid.Row columns="equal">
          <Grid.Column>
            <h3>Ingredients</h3>
          </Grid.Column>
        </Grid.Row>
        {createIngredients()}
        <Grid.Row>
          <Grid.Column>
            <Button onClick={() => dispatch({ type: 'ADD_INGREDIENT' })}>
              <Icon name="plus" /> Add Ingredient
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
}
export default Ingredients;
