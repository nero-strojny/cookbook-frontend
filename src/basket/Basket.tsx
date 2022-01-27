import React, { useContext, useState } from "react";
import { Checkbox, Grid, Button, Label, Segment, List, Card, SemanticWIDTHSNUMBER, Header, Icon, Form } from "semantic-ui-react";
import { ServerRequestContext } from "../context/ServerRequestContext";
import { flatMap, groupBy, findIndex, set } from 'lodash';
import { emailBasket } from "../serviceCalls";
import { Ingredient } from "../types/ingredient";
import SelectedRecipesSegment from "./SelectedRecipesSegment";

const Basket = ({width}: {width:number}): JSX.Element => {
  const { state, dispatch } = useContext(ServerRequestContext);

  const [ ingredientsToNotEmail, setIngredientsToNotEmail ] = useState<string[]>([]);
  const measurementsToPluralize = ["clove", "cup", "stalk", "slice", "lb"];
  const defaultIngredients = flatMap(state.basket, recipe => recipe.ingredients);
  const [ ingredients, setIngredients ] = useState<Ingredient[]>(defaultIngredients);
  const defaultNewIngredient: Ingredient = {_id:'', name: '', category: '', amount: 0, measurement: '' }
  const [ newIngredient, setNewIngredient ] = useState<Ingredient>(defaultNewIngredient);
  const ingredientCategories = ["produce", "pantry", "protein", "dairy", "alcohol"];

  let ingredientCardsPerRow: SemanticWIDTHSNUMBER = 1;
  if (width > 1100) {
    ingredientCardsPerRow = 5;
  } else if (width > 900){
    ingredientCardsPerRow = 4;
  } else if (width > 700) {
    ingredientCardsPerRow = 3;
  } else if (width > 500) {
    ingredientCardsPerRow = 2;
  }

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
    tempArray = [...ingredients, newIngredient];
    setIngredients(tempArray);
    setNewIngredient(defaultNewIngredient);
  }

  const determineIngredientString = (sameIngredientList: Ingredient[]) => {
    let quantityString = "";
    let addToTaste = false;

    sameIngredientList.forEach(ingredient => {
      if (measurementsToPluralize.includes(ingredient.measurement)) {
        ingredient.measurement = `${ingredient.measurement}s`
      }
      if(ingredient.amount === undefined || ingredient.amount === 0) {
        addToTaste = true;
      }
    });
    const sameMeasurements = groupBy(sameIngredientList, ingredient => ingredient.measurement);
  
    Object.values(sameMeasurements)
      .filter(measurementGroup => findIndex(measurementGroup, group => group.amount !== undefined) !== -1)
      .forEach(measurementGroup => {
      let totalQuantity = 0;
      measurementGroup.forEach(ingredient => {
        if(ingredient.amount !== undefined && ingredient.amount !== 0) {
          totalQuantity+=ingredient.amount;
        } else {
          addToTaste = true;
        }
      });
      if(totalQuantity) {
        const measurementStr = measurementGroup[0].measurement ? ` ${measurementGroup[0].measurement}` : "";
        quantityString += `${totalQuantity}${measurementStr}`;
      }
      if (Object.values(sameMeasurements).length > 1) {
        quantityString += ' + ';
      }
    });
    if(`(${quantityString})` === '()') {
      if(addToTaste) {
        return `${sameIngredientList[0].name}*`;
      }
      return `${sameIngredientList[0].name}`;
    }
    if (quantityString.substring(quantityString.length - 3 , quantityString.length) === " + ") {
      quantityString = quantityString.substring(0, quantityString.length - 3);
    }
    if(addToTaste) {
      return `${sameIngredientList[0].name} (${quantityString})*`;
    }
    return `${sameIngredientList[0].name} (${quantityString})`;
  }

  const generateIngredientStrings = (categoryName: string) => {
    const categoryGroupIngredients = groupBy(ingredients, ingredient => ingredient.category);
    const sameIngredientGroups = groupBy(categoryGroupIngredients[categoryName], ingredient => ingredient._id);
    const sortedIngredientGroup = Object.values(sameIngredientGroups).sort((a,b) => (a[0].name > b[0].name) ? 1 : -1);
    return sortedIngredientGroup.map(sameIngredient => determineIngredientString(sameIngredient));
  }

  const generateBasketRows = (categoryName: string) => {
    const ingredientBoxes = generateIngredientStrings(categoryName).map(ingredientString => {
      const itemStyle = ingredientsToNotEmail.includes(ingredientString) ?
        { textDecorationLine: 'line-through',
          color: 'black',
          textDecorationColor: 'black',
          textDecorationThickness: '0.2em'
        } :
        { color: 'black' };
        return (
        <List.Item
          onClick={()=>changeIngredientsToNotEmail(ingredientString)}
          style={itemStyle}>
            {ingredientString}
        </List.Item>);
    });
    return <List selection>
        {ingredientBoxes}
      </List>;
  }

  const emailIngredients = async () => {
    let ingredientObject = {};
    ingredientCategories.forEach(category => {
        set(ingredientObject, category, generateIngredientStrings(category).filter(ingredient => !ingredientsToNotEmail.includes(ingredient)))
    });
    const response = await emailBasket(ingredientObject, state.accessToken)
    if (response.status === 200) {
        dispatch({ type: 'SHOW_MESSAGE', payload: { messageContent: `Shopping list has been emailed!`, success: true }});
    } else if (response.status === 401 || response.status === 403) {
        dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
    } else {
      dispatch({ type: 'SHOW_MESSAGE', payload: { messageContent: `Emailing shopping list failed due to an error`, success: false }});
    }
  }

  const generateBasketIngredients = () => {
    const categoryGroupIngredients = groupBy(ingredients, ingredient => ingredient.category);
    return (<Grid>
      <Grid.Row>
        <Grid.Column width={5}>
          <Header as='h3'>Shopping List</Header>
        </Grid.Column>
        <Grid.Column width={5} floated='right' textAlign='right'>
          <Button color='orange' onClick={() => emailIngredients()}>Send To Email</Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered columns={1}>
        <Grid.Column width={13}>
          <Form>
            <Form.Group>
              <Form.Input
                width={2}
                label="Add Item"
                placeholder='Amount' 
                onChange={(event) => changeNewIngredient('amount', parseFloat(event.target.value))}
              />
              <Form.Input
                width={3}
                style={{marginTop:'24px'}}
                placeholder='Measurement'
                onChange={(event) => changeNewIngredient('measurement', event.target.value)}
                />
              <Form.Input
                width={5}
                style={{marginTop:'24px'}}
                placeholder='Item'
                onChange={(event) => changeNewIngredient('name', event.target.value)}
              />
              <Form.Input
                width={5}
                list='categories'
                placeholder='Category'
                style={{marginTop:'24px'}}
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
                icon width={1} color='orange'
                style={{marginTop:'24px'}}
                disabled={!newIngredient.name || !newIngredient.category}
                onClick={() => addIngredient()}>
                <Icon name="plus" />
              </Form.Button>
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1} style={{margin:'15px'}}>
        <Grid.Column width={16}>
        <Card.Group centered itemsPerRow={ingredientCardsPerRow}>
          {
            ingredientCategories.map(categoryName => {
              return (categoryGroupIngredients[categoryName]
                && categoryGroupIngredients[categoryName].length) ?
                <Card>
                  <Card.Content>
                    <Card.Header>
                      {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                    </Card.Header>
                    <Card.Meta></Card.Meta>
                    <Card.Description>
                      {generateBasketRows(categoryName)}
                    </Card.Description>
                  </Card.Content>
                </Card> : <></>
          })}
        </Card.Group>
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