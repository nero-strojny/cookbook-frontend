import React, { useCallback, useContext, useState } from "react";
import { Grid, Form, Dropdown, Button, Label, Divider, Modal, Message, Transition } from "semantic-ui-react";
import { RecipeContext } from "../context/RecipeContext";
import { searchIngredient, createIngredient } from "../serviceCalls";
import { ServerRequestContext } from "../context/ServerRequestContext";
import { Ingredient } from "../types/ingredient";
import { debounce } from "lodash";

const Ingredients = (): JSX.Element => {
  const { dispatch, state } = useContext(RecipeContext);
  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  const { ingredients: currentIngredients } = state;
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ newName, setNewName ] = useState<string>("");
  const [ newMeasurement, setNewMeasurement ] = useState<string>("");
  const [ newAmount, setNewAmount ] = useState<number>(0);
  const [ selectionOptions, setSelectionOptions ] = useState<Ingredient[]>([]);
  const [ openModal, setOpenModal ] = useState<boolean>(false);
  const [ newIngredientName, setNewIngredientName ] = useState<string>("");
  const [ newCategory, setNewCategory ] = useState<string>("");
  const [ successfulPost, setSuccessfulPost ] = useState<boolean>(false);

  const addIngredient = () => {
    const selectedOption = selectionOptions.find(option => option.name === newName);
    if (selectedOption) {
      dispatch({
        type:'ADD_INGREDIENT',
        payload: {
          ingredient: {
            name: newName,
            amount: newAmount,
            measurement: newMeasurement,
            _id: selectedOption._id, 
            category: selectedOption.category
          }
        }
      });
      setNewName("");
      setNewMeasurement("");
      setNewAmount(0);
      setSelectionOptions([]);
    }
  }

  const submitSearch = async (prefix: string) => {
    if(prefix !== "") {
      setIsLoading(true);
      console.log(prefix);
      const response = await searchIngredient(prefix, serverState.accessToken);
      if (response.status === 401 || response.status === 403) {
        serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
      }
      setSelectionOptions(response.data);
      setIsLoading(false);
    } else {
      setSelectionOptions([]);
    }
  }

  const debouncedSubmitSearch = useCallback(
    debounce(submitSearch, 300)
  , []);

  const postNewIngredient = async () => {
    setIsLoading(true);
    const response = await createIngredient(
      { name: newIngredientName || newName, category: newCategory},
    serverState.accessToken);
    if (response.status === 401 || response.status === 403) {
      serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
    }
    setSelectionOptions([response.data]);
    setSuccessfulPost(true);
    setIsLoading(false);
  }

  const createIngredients = () => {
    let ingredientInputs = [
      <Grid.Row columns="equal" key="ingredient">
        <Grid.Column width={1}>
        </Grid.Column>
        <Grid.Column width={3}>
          <h4>Amount</h4>
        </Grid.Column>
        <Grid.Column width={4}>
          <h4>Measurement</h4>
        </Grid.Column>
        <Grid.Column width={4}>
          <h4>Name</h4>
        </Grid.Column>
        <Grid.Column width={2} />
      </Grid.Row>
    ];

    // Do not display the default ingredient list
    if (currentIngredients.length > 0 ) {
      for (let i = 0; i < currentIngredients.length; i++) {
        ingredientInputs.push(
          <Grid.Row columns="equal" key={`ingredient${i}`}>
            <Grid.Column width={1} />
            <Grid.Column width={3}>
              {
                currentIngredients.length >= 1
                  ? currentIngredients[i].amount > 0 
                    ? currentIngredients[i].amount  
                    : ""
                  : ""
              }
            </Grid.Column>
            <Grid.Column width={4}>
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
              <Button size='mini' color='orange' inverted circular icon='x'
                onClick={() => dispatch({ 
                  type: 'DELETE_INGREDIENT',
                  payload: { indexSelected: i }
                })}>
              </Button>
            </Grid.Column>
          </Grid.Row>
        );
        ingredientInputs.push(
          <Grid.Row columns="equal" key={`divider${i}`}>
            <Grid.Column width={16}>
              <Divider fitted />
            </Grid.Column>
          </Grid.Row>
        )
      }
    }
    
    return ingredientInputs;
  }

  const modalContent = (
    <Form>
    <Grid style={{margin:'15px'}} centered columns={2}>
      <Grid.Row>
        <Grid.Column>
          <Transition visible={successfulPost} animation="scale">
            <Message
              positive
              onDismiss={()=>setSuccessfulPost(false)}
              header={"Success!"}
              content={`Added New Ingredient: "${newIngredientName || newName}"`}
            />
          </Transition>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input inline
            label="Name:"
            defaultValue={newName}
            onChange={(event) => setNewIngredientName(event.target.value)} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input inline
            list='categories'
            label="Category:"
            onChange={(event) => setNewCategory(event.target.value)}/>
          <datalist id='categories'>
            <option value='produce'/>
            <option value='protein'/>
            <option value='pantry'/>
            <option value='dairy'/>
            <option value='alcohol'/>
          </datalist>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column textAlign={"center"}>
          <Button onClick={()=>postNewIngredient()} loading={isLoading}>Submit</Button>
        </Grid.Column>
      </Grid.Row>
  </Grid>
  </Form>
  )

  return (
    <Form>
      <Grid>
        <Grid.Row columns="equal">
          <Grid.Column>
            <h3>Ingredients</h3>
          </Grid.Column>
        </Grid.Row>
        {createIngredients()}
      </Grid>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
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
          <Grid.Column width={3}>
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
                onChange={(_event, { value }) => setNewName(String(value))}
                onAddItem={() => setOpenModal(true)}
                loading={isLoading}
                options={selectionOptions.map(opt => ({text: opt.name, value: opt.name, key: opt.name}))}
                onSearchChange={(event) => {
                  const element = event.target as HTMLInputElement
                  debouncedSubmitSearch(element.value);
                }}
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={4} textAlign="center" verticalAlign="middle">
            <Button size='mini' color='orange' inverted circular icon='plus'
              onClick={() => addIngredient()}
              disabled={newName === ""}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {state.ingredients.length <= 0 &&(
              <Label pointing color="red">Please enter at least one ingredient</Label>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Modal
        open={openModal}
        size={"small"}
        onClose={()=>{setOpenModal(false); setSuccessfulPost(false);}}
        header='Add Ingredient'
        content={modalContent}
        actions={[{ key: 'done', content: 'Done', positive: true }]}
      />
    </Form>
  );

}
export default Ingredients;