import React, { useContext, useState } from "react";
import { Grid, Icon, Form, Dropdown, Button } from "semantic-ui-react";
import { RecipeContext } from "../RecipeContext";
import { searchIngredient, createIngredient } from "../serviceCalls";
import { ServerRequestContext } from "../ServerRequestContext";

function Ingredients(){
  const { dispatch, state } = useContext(RecipeContext);
  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  const { ingredients: currentIngredients } = state;
  const [ isLoading, setIsLoading ] = useState(false);
  const [ newName, setNewName ] = useState("");
  const [ newMeasurement, setNewMeasurement ] = useState("");
  const [ newAmount, setNewAmount ] = useState(0);
  const [ selectionOptions, setSelectionOptions ] = useState([]);

  function addIngredient() {
    const selectedOption = selectionOptions.find(option => option.name === newName);
    console.log(selectedOption);
    dispatch({
      type:'ADD_INGREDIENT',
      payload: {
        ingredient: {
          name: newName,
          amount: newAmount,
          measurement: newMeasurement,
          _id: selectedOption._id
        }
      }
    });
    setNewName("");
    setNewMeasurement("");
    setNewAmount(0);
    setSelectionOptions([]);
  }

  async function submitSearch(prefix) {
    if(prefix !== "") {
      setIsLoading(true);
      const response = await searchIngredient(prefix, serverState.accessToken);
      if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS' });
      }
      setSelectionOptions(response.data);
      setIsLoading(false);
    }
  }

  async function addSelection(ingredientName) {
    setIsLoading(true);
    const response = await createIngredient({name: ingredientName}, serverState.accessToken);
    if (response.status === 401 || response.status === 403) {
      serverDispatch({ type: 'LOGOUT_SUCCESS' });
    }
    setSelectionOptions([response.data]);
    setIsLoading(false);
  }

  function createIngredients() {
    let ingredientInputs = [
      <Grid.Row columns="equal" key="ingredient">
        <Grid.Column width={2}>
          <h4>Amount</h4>
        </Grid.Column>
        <Grid.Column width={2}>
          <h4>Measurement</h4>
        </Grid.Column>
        <Grid.Column width={4}>
          <h4>Name</h4>
        </Grid.Column>
        <Grid.Column width={2}>
        </Grid.Column>
      </Grid.Row>
    ];

    // Do not display the default ingredient list
    if (!(currentIngredients.length === 1 && currentIngredients[0] !== {name:"", amount: 0, measurement: ""})) {
      for (let i = 0; i < currentIngredients.length; i++) {
        ingredientInputs.push(
          <Grid.Row columns="equal" key={`ingredient${i}`}>
            <Grid.Column width={2}>
              {
                currentIngredients.length >= 1
                  ? currentIngredients[i].amount > 0 
                    ? currentIngredients[i].amount  
                    : ""
                  : ""
              }
            </Grid.Column>
            <Grid.Column width={2}>
              {
                currentIngredients.length >= 1
                  ? currentIngredients[i].measurement
                  : ""
              }
            </Grid.Column>
            <Grid.Column width={4}>
              {
                currentIngredients.length >= 1
                  ? currentIngredients[i].name
                  : ""
              }
            </Grid.Column>
            <Grid.Column width={2} textAlign="center" verticalAlign="middle">
              <Button size='mini' color='orange' inverted
                onClick={() => dispatch({ 
                  type: 'DELETE_INGREDIENT',
                  payload: { indexSelected: i }
                })}>
                  <Icon name="trash" />
                  Delete
              </Button>
            </Grid.Column>
          </Grid.Row>
        );
      }
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
          <Grid.Column width={2}>
            <Form.Field>
              <input
                value={newAmount}
                type="number"
                onChange={(event) =>
                  setNewAmount(parseFloat(event.target.value))
                }
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={2}>
            <Form.Field>
              <input
                value={newMeasurement}
                onChange={(event) =>
                  setNewMeasurement(event.target.value)
                }
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Field>
              <Dropdown
                search
                selection
                clearable
                allowAdditions
                onChange={(_event, { value }) => setNewName(value)}
                onAddItem={(_event, { value }) => addSelection(value)}
                loading={isLoading}
                options={selectionOptions.map(opt => ({text: opt.name, value: opt.name, key: opt.name}))}
                onSearchChange={(event) =>
                  submitSearch(event.target.value)
                }
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            <Button size='mini' color='orange' inverted
              onClick={() => addIngredient()}
              disabled={newName === ""}
            >
              <Icon name="plus" />
              Add
            </Button>
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );

}
export default Ingredients;