
import React, { useContext } from "react";
import { Icon, Checkbox, Grid, Card } from "semantic-ui-react";
import { ServerRequestContext } from "../ServerRequestContext";
import { flatMap, groupBy } from 'lodash';

export const defaultTags = [ "dinner", "lunch", "breakfast", "snack", "side dish", "main dish"];

function Basket() {
    const { state, dispatch } = useContext(ServerRequestContext);

    function generateBasketIngredients(){
      const ingredients = flatMap(state.basket, recipe => recipe.ingredients);
      const groupedIngredients = groupBy(ingredients, ingredient => ingredient._id);
      console.log(groupedIngredients);
      const checklist = Object.values(groupedIngredients).map(ingredientGroup => (
        <Grid.Row columns="equal">
          <Grid.Column>
            <Checkbox label={ingredientGroup[0].name} />
          </Grid.Column>
        </Grid.Row>
      ));
      return <Grid style={{marginLeft:'10px'}}>{checklist}</Grid>;
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
          </Grid.Row>
      </Grid>
    );
}

export default Basket;