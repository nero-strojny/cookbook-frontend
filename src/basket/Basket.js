
import React, { useContext } from "react";
import { Checkbox, Grid, Card } from "semantic-ui-react";
import { ServerRequestContext } from "../ServerRequestContext";
import { flatMap, groupBy } from 'lodash';

export const defaultTags = [ "dinner", "lunch", "breakfast", "snack", "side dish", "main dish"];

function Basket() {
    const { state } = useContext(ServerRequestContext);

    function generateBasketIngredients(){
      const checklist = [];
      const ingredients = flatMap(state.basket, recipe => recipe.ingredients);
      const categoryGroupIngredients = groupBy(ingredients, ingredient => ingredient.category);
      Object.values(categoryGroupIngredients).forEach(ingredientGroup => {
        const sameIngredientGroups = groupBy(ingredientGroup, ingredient => ingredient._id);
        const ingredientBoxes = Object.values(sameIngredientGroups).map(sameIngredient => (
          <Grid.Row columns="equal">
            <Grid.Column>
              <Checkbox label={sameIngredient[0].name} />
            </Grid.Column>
          </Grid.Row>
        ));
        checklist.push(
          <Grid.Row columns="equal">
            <Grid.Column>
              <h3>{ingredientGroup[0].category}</h3>
            </Grid.Column>
          </Grid.Row>
        );
        checklist.push(ingredientBoxes)
      });
      return <Grid style={{marginLeft:'10px'}}>{checklist}</Grid>;
    }

    function generateBasketRecipes () {
      return state.basket.map(recipe => (
        <Card>
          <Card.Content header={recipe.recipeName} />
          <Card.Description>
          </Card.Description>
          <Card.Content extra>
          </Card.Content>
        </Card>
      ))
    }

    return (
      <Grid padded>
        <Grid.Row columns="equal">
          <Grid.Column>
            <Card>
              <Card.Content header='Shopping List' />
              <Card.Description>
                {generateBasketIngredients()}
              </Card.Description>
              <Card.Content extra>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            {generateBasketRecipes()}
          </Grid.Column>
          </Grid.Row>
      </Grid>
    );
}

export default Basket;