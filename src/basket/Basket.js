
import React, { useContext } from "react";
import { Checkbox, Grid, Button, Label, Segment, GridColumn, List } from "semantic-ui-react";
import { ServerRequestContext } from "../ServerRequestContext";
import { flatMap, groupBy } from 'lodash';

export const defaultTags = [ "dinner", "lunch", "breakfast", "snack", "side dish", "main dish"];

function Basket() {
    const { state, dispatch } = useContext(ServerRequestContext);

    function generateBasketRows(categoryIngredientGroups, categoryName){
        const sameIngredientGroups = groupBy(categoryIngredientGroups[categoryName], ingredient => ingredient._id);
        const sortedIngredientGroup = Object.values(sameIngredientGroups).sort((a,b) => (a[0].name > b[0].name) ? 1 : -1);
        const ingredientBoxes = sortedIngredientGroup.map(sameIngredient => (
          <Grid.Row columns="equal" style={{marginTop:'10px'}}>
            <Grid.Column>
              <Checkbox defaultChecked label={sameIngredient[0].name} />
            </Grid.Column>
          </Grid.Row>
        ));
      return (<>
        <Grid.Row columns="equal" style={{marginTop:'15px'}}>
          <Grid.Column>
            <h3>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h3>
          </Grid.Column>
        </Grid.Row>
        {ingredientBoxes}</>);
    }

    function generateBasketIngredients(){
      const ingredients = flatMap(state.basket, recipe => recipe.ingredients);
      const categoryGroupIngredients = groupBy(ingredients, ingredient => ingredient.category);
      const {pantry, produce, protein, dairy, alcohol} = categoryGroupIngredients;

      return (<Grid>
        <Grid.Row>
          <Grid.Column width={4} style={{marginTop:'10px'}}>
            {(produce && produce.length) && (<>{generateBasketRows(categoryGroupIngredients, "produce")}</>)}
          </Grid.Column>
          <GridColumn width={4} style={{marginTop:'10px'}}>
            {(pantry && pantry.length) && (<>{generateBasketRows(categoryGroupIngredients, "pantry")}</>)}
          </GridColumn>
          <GridColumn width={4} style={{marginTop:'10px'}}>
            {(protein && protein.length) && (<>{generateBasketRows(categoryGroupIngredients, "protein")}</>)}
          </GridColumn>
          <GridColumn width={4} style={{marginTop:'10px'}}>  
            {(dairy && dairy.length) && (<>{generateBasketRows(categoryGroupIngredients, "dairy")}</>)}
            {(alcohol && alcohol.length) && (<>{generateBasketRows(categoryGroupIngredients, "alcohol")}</>)}
          </GridColumn>
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

          <List>
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