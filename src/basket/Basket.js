
import React, { useContext } from "react";
import { Checkbox, Grid, Button, Label, Segment, List } from "semantic-ui-react";
import { ServerRequestContext } from "../ServerRequestContext";
import { flatMap, groupBy, findIndex } from 'lodash';

export const defaultTags = [ "dinner", "lunch", "breakfast", "snack", "side dish", "main dish"];

function Basket() {
    const { state, dispatch } = useContext(ServerRequestContext);
    const measurementsToPluralize = ["clove", "cup", "stalk", "slice", "lb"];

    function determineIngredientString(sameIngredientList){
      let quantityString = "";
      let addToTaste = false;

      sameIngredientList.forEach(ingredient => {
        if (measurementsToPluralize.includes(ingredient.measurement)) {
          ingredient.measurement = `${ingredient.measurement}s`
        }
        if(ingredient.amount === undefined || ingredient.amount === 0) {
          addToTaste = true;
        }
        if(ingredient.name === "salt") {console.log(ingredient, ingredient.amount, addToTaste)}
        
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

    function generateBasketRows(categoryIngredientGroups, categoryName){
        const sameIngredientGroups = groupBy(categoryIngredientGroups[categoryName], ingredient => ingredient._id);
        const sortedIngredientGroup = Object.values(sameIngredientGroups).sort((a,b) => (a[0].name > b[0].name) ? 1 : -1);
        const ingredientBoxes = sortedIngredientGroup.map(sameIngredient => {
          return (<Grid.Row columns="equal" style={{marginTop:'10px'}}>
            <Grid.Column>
              <Checkbox defaultChecked label={determineIngredientString(sameIngredient)} />
            </Grid.Column>
          </Grid.Row>);
        });
      return (<>
        <Grid.Row columns="equal" style={{marginTop:'15px'}}>
          <Grid.Column>
            <h3>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h3>
          </Grid.Column>
        </Grid.Row>
        {ingredientBoxes}
      </>);
    }

    function generateBasketIngredients(){
      const ingredients = flatMap(state.basket, recipe => recipe.ingredients);
      const categoryGroupIngredients = groupBy(ingredients, ingredient => ingredient.category);
      const {pantry, produce, protein, dairy, alcohol} = categoryGroupIngredients;

      return (<Grid>
        <Grid.Row>
          <Grid.Column width={10} style={{marginTop:'10px'}}>
            * = Not specified in the recipe, add to taste
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4} style={{marginTop:'10px'}}>
            {(produce && produce.length) && (<>{generateBasketRows(categoryGroupIngredients, "produce")}</>)}
          </Grid.Column>
          <Grid.Column width={4} style={{marginTop:'10px'}}>
            {(pantry && pantry.length) && (<>{generateBasketRows(categoryGroupIngredients, "pantry")}</>)}
          </Grid.Column>
          <Grid.Column width={4} style={{marginTop:'10px'}}>
            {(protein && protein.length) && (<>{generateBasketRows(categoryGroupIngredients, "protein")}</>)}
          </Grid.Column>
          <Grid.Column width={4} style={{marginTop:'10px'}}>  
            {(dairy && dairy.length) && (<>{generateBasketRows(categoryGroupIngredients, "dairy")}</>)}
            {(alcohol && alcohol.length) && (<>{generateBasketRows(categoryGroupIngredients, "alcohol")}</>)}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4} floated='right'>
            <Button color='orange'>Send To Email</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>)
    }

    function generateBasketRecipes () {
      return (
        <Segment>
          <Label as='a' color='orange' size='large' ribbon>
            Included Recipes
          </Label>
          <List bulleted>
          {state.basket.map(recipe => 
            (
              <List.Item> {recipe.recipeName} </List.Item>
            ))}
          </List>
        </Segment>
      )
    }

    return (
      <Grid padded>
          {
            (state.basket && state.basket.length) ?
            (<>
              <Grid.Row>
                <Grid.Column>
                  <Button color="orange" inverted onClick={() => dispatch({ type: 'EMPTY_BASKET' })}>
                    {`Empty Basket`}
                    </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{marginLeft:'10px'}}>
                <Grid.Column width={4}>
                  {generateBasketRecipes()}
                </Grid.Column>
                <Grid.Column width={12}>
                  <Segment>
                    <Label as='a' color='orange' size='large' ribbon>
                      Shopping List
                    </Label>
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