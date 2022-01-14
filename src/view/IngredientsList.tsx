import React, { useState } from "react";
import { Grid, Icon, List } from "semantic-ui-react"
import { Ingredient } from "../types/ingredient";

type IngredientsListProps = {
  ingredients: Ingredient[];
  recipeId?: string;
}

const IngredientsList = ({ ingredients, recipeId }: IngredientsListProps): JSX.Element => {

  const [ingredientsVisible, setIngredientsVisible] = useState<boolean>(false);

  const getIngredientEntry = (name: string, amount: number, measurement: string) => {
    if (!measurement && amount) {
      return `${amount} ${name}`;
    } else if (!measurement && !amount) {
      return `some ${name}`;
    }
    return `${amount} ${measurement} of ${name}`;
  }

  return ingredientsVisible ?
    (
      <Grid.Row>
        <Grid.Column>
          <h4>
            <p style={{ cursor: 'pointer' }}
              onClick={() => setIngredientsVisible(false)}>
              <Icon name="minus" color='orange' ></Icon>
              {"\tIngredients"}
            </p>
          </h4>
          <List bulleted>
            {ingredients.map((ingredient) => (
              <List.Item key={"ingredient-" + ingredient.name + recipeId}>
                {getIngredientEntry(ingredient.name, ingredient.amount, ingredient.measurement)}
              </List.Item>
            ))}
          </List>
        </Grid.Column>
      </Grid.Row>
    ) :
    (
      <Grid.Row>
        <Grid.Column>
          <h4>
            <p style={{ cursor: 'pointer' }}
              onClick={() => setIngredientsVisible(true)}>
              <Icon name="plus" color='orange' ></Icon>
              {"\tIngredients ..."}
            </p>
          </h4>
        </Grid.Column>
      </Grid.Row>
    );
}

export default IngredientsList;