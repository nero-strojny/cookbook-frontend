import { groupBy } from "lodash";
import React from "react";
import { Card, List, SemanticWIDTHSNUMBER } from "semantic-ui-react";
import { Ingredient } from "../types/ingredient";
import { generateIngredientStrings, ingredientCategories } from "./visualizeIngredients";

type IngredientCardsProps = { 
  width: number;
  ingredients: Ingredient[];
  ingredientsToNotEmail: string[];
  changeIngredientsToNotEmail: Function;
}

const IngredientCards = ({
  width,
  ingredients,
  ingredientsToNotEmail,
  changeIngredientsToNotEmail
}: IngredientCardsProps) => {
  const categoryGroupIngredients = groupBy(ingredients, ingredient => ingredient.category);

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

  const generateBasketRows = (categoryName: string) => {
    const ingredientBoxes = generateIngredientStrings(ingredients, categoryName).map(ingredientString => {
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

  return (<Card.Group centered itemsPerRow={ingredientCardsPerRow}>
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
  </Card.Group>);
}

export default IngredientCards;