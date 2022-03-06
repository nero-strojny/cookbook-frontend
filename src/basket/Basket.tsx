import React, {useContext, useReducer, useState} from "react";
import { Grid, Button, Segment, Header, Icon, Form } from "semantic-ui-react";
import { ServerRequestContext } from "../context/ServerRequestContext";
import { flatMap, set } from 'lodash';
import { emailBasket } from "../serviceCalls";
import { Ingredient } from "../types/ingredient";
import SelectedRecipesSegment from "./SelectedRecipesSegment";
import IngredientCards from "./IngredientCards";
import { generateIngredientStrings, ingredientCategories } from "./visualizeIngredients";

interface EmailState {
  error: boolean;
  message?: string;
  loading: boolean;
}

export type EmailAction = {
  type: string,
  payload: {
    message?: string;
  }
}

const emailReducer = (state: EmailState, action: EmailAction): EmailState =>  {
  switch (action.type) {
    case 'SUCCESS':
      return {message: action.payload.message, error: false, loading: false};
    case 'FAILURE':
      return {message: action.payload.message, error: true, loading: false};
    case 'LOADING':
      return {...state, loading: true, message: ""};
    case 'CLEAR':
      return {...state, loading: false, message: "", error: false};
    default:
      throw new Error();
  }
}

const Basket = ({width}: {width:number}): JSX.Element => {
  const { state, dispatch } = useContext(ServerRequestContext);
  const ingredients = flatMap(state.basket, recipe => recipe.ingredients);
  const defaultNewIngredient: Ingredient = {_id:'', name: '', category: '', amount: 0, measurement: '' };
  const [ ingredientsToNotEmail, setIngredientsToNotEmail ] = useState<string[]>([]);
  const [ additionalIngredients, setAdditionalIngredients] = useState<Ingredient[]>([]);
  const [ newIngredient, setNewIngredient ] = useState<Ingredient>({...defaultNewIngredient});
  const [{error, loading, message}, emailDispatch] = useReducer(emailReducer, {message: "", error: false, loading: false});

  const changeIngredientsToNotEmail = (ingredientString: string) => {
    let tempArray = [];
    if(ingredientsToNotEmail.includes(ingredientString)){
      tempArray = ingredientsToNotEmail.filter(ingredientToNotEmail => ingredientToNotEmail !== ingredientString);
    } else {
      tempArray = [...ingredientsToNotEmail, ingredientString];
    }
    setIngredientsToNotEmail(tempArray);
  }

  const changeNewIngredient = (key: string, value: string | number) => {
    let tempIngredient = {...newIngredient};
    set(tempIngredient, key, value);
    setNewIngredient(tempIngredient);
  }

  const addIngredient = () => {
    let tempArray = [];
    tempArray = [...additionalIngredients, {...newIngredient, _id: newIngredient.name}];
    setAdditionalIngredients(tempArray);
    setNewIngredient(defaultNewIngredient);
  }

  const emailIngredients = async () => {
    emailDispatch({ type: 'LOADING', payload: {} })
    let ingredientObject = {};
    ingredientCategories.forEach(category => {
        set(ingredientObject, category, generateIngredientStrings(
          [...ingredients, ...additionalIngredients], category).filter(ingredient => !ingredientsToNotEmail.includes(ingredient)))
    });
    const response = await emailBasket(ingredientObject, state.accessToken)
    if (response.status === 200) {
      emailDispatch({ type: 'SUCCESS', payload: {}})
      dispatch({ type: 'SHOW_MESSAGE', payload: { messageContent: `Shopping list has been emailed!`, success: true }});
    } else if (response.status === 401 || response.status === 403) {
        dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
    } else {
      emailDispatch({ type: 'FAILURE', payload: {}})
      dispatch({ type: 'SHOW_MESSAGE', payload: { messageContent: `Emailing shopping list failed due to an error`, success: false }});
    }
  }

  const generateBasketIngredients = () => {
    return (<Grid>
      <Grid.Row>
        <Grid.Column width={5}>
          <Header as='h3'>Shopping List</Header>
        </Grid.Column>
        <Grid.Column width={5} floated='right' textAlign='right'>
          <Button color='orange' loading={loading} onClick={() => emailIngredients()}>Send To Email</Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered columns={1}>
        <Grid.Column width={13}>
          <Form>
            <Form.Group>
              <Form.Input
                type='number'
                width={2}
                label="Add Item"
                placeholder='Amount'
                value={newIngredient.amount}
                onChange={(event) => changeNewIngredient('amount', parseFloat(event.target.value))}
              />
              <Form.Input
                width={3}
                style={{marginTop:'24px'}}
                placeholder='Measurement'
                value={newIngredient.measurement}
                onChange={(event) => changeNewIngredient('measurement', event.target.value)}
                />
              <Form.Input
                width={5}
                style={{marginTop:'24px'}}
                placeholder='Item'
                value={newIngredient.name}
                onChange={(event) => changeNewIngredient('name', event.target.value)}
              />
              <Form.Input
                width={5}
                list='categories'
                placeholder='Category'
                style={{marginTop:'24px'}}
                value={newIngredient.category}
                onChange={(event) => changeNewIngredient('category', event.target.value)}/>
              <datalist id='categories'>
                <option value='produce'/>
                <option value='protein'/>
                <option value='pantry'/>
                <option value='dairy'/>
                <option value='alcohol'/>
                <option value='other'/>
              </datalist>
              <Form.Button
                icon fluid color='orange'
                style={{marginTop:'24px'}}
                disabled={!newIngredient.name || !newIngredient.category}
                onClick={() => addIngredient()}
              >
                <Icon name="plus" />
              </Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1} style={{margin:'15px'}}>
        <Grid.Column width={16}>
        <IngredientCards
          width={width}
          ingredients={ [...ingredients, ...additionalIngredients]}
          ingredientsToNotEmail={ingredientsToNotEmail}
          changeIngredientsToNotEmail={changeIngredientsToNotEmail} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={5}>
          * = Amount Not Specified
        </Grid.Column>
      </Grid.Row>
    </Grid>)
  }

  return (
    <Grid padded>
      {
        (state.basket && state.basket.length) ?
        (<>
          <Grid.Row columns={1} centered>
            <Grid.Column width={16}>
            <SelectedRecipesSegment width={width} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1} centered>
            <Grid.Column width={16}>
              <Segment style={{
                border: '1px solid lightgrey',
                borderRadius:'5px',
                textAlign: 'left'
                }} basic>
                  {generateBasketIngredients()}
              </Segment>
            </Grid.Column>
        </Grid.Row></>) :
        (<Grid.Row>
          <Grid.Column>
            <h3>No Recipes in Basket</h3>
          </Grid.Column>
          </Grid.Row>
        )
      }
    </Grid>
  );
}

export default Basket;