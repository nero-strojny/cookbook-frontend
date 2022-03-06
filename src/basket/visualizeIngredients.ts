import {findIndex, groupBy} from "lodash";
import {Ingredient} from "../types/ingredient";

export const ingredientCategories = ["produce", "pantry", "protein", "dairy", "alcohol", "other"];

export const generateIngredientStrings = (ingredients: Ingredient[], categoryName: string) => {
  const categoryGroupIngredients = groupBy(ingredients, ingredient => ingredient.category);
  const sameIngredientGroups = groupBy(categoryGroupIngredients[categoryName], ingredient => ingredient._id);
  const sortedIngredientGroup = Object.values(sameIngredientGroups).sort((a, b) => (a[0].name > b[0].name) ? 1 : -1);
  return sortedIngredientGroup.map(sameIngredient => determineIngredientString(sameIngredient));
}

export const determineIngredientString = (sameIngredientList: Ingredient[]) => {
  let quantityString = "";
  let addToTaste = false;
  const measurementsToPluralize = ["clove", "cup", "stalk", "slice", "lb"];

  sameIngredientList.forEach(ingredient => {
    if (measurementsToPluralize.includes(ingredient.measurement)) {
      ingredient.measurement = `${ingredient.measurement}s`
    }
    if (ingredient.amount === undefined || ingredient.amount === 0) {
      addToTaste = true;
    }
  });
  const sameMeasurements = groupBy(sameIngredientList, ingredient => ingredient.measurement);

  Object.values(sameMeasurements)
    .filter(measurementGroup => findIndex(measurementGroup, group => group.amount !== undefined) !== -1)
    .forEach(measurementGroup => {
      let totalQuantity = 0;
      measurementGroup.forEach(ingredient => {
        if (ingredient.amount !== undefined && ingredient.amount !== 0) {
          totalQuantity += ingredient.amount;
        } else {
          addToTaste = true;
        }
      });
      if (totalQuantity) {
        const measurementStr = measurementGroup[0].measurement ? ` ${measurementGroup[0].measurement}` : "";
        quantityString += `${totalQuantity}${measurementStr}`;
      }
      if (Object.values(sameMeasurements).length > 1) {
        quantityString += ' + ';
      }
    });
  if (`(${quantityString})` === '()') {
    if (addToTaste) {
      return `${sameIngredientList[0].name}*`;
    }
    return `${sameIngredientList[0].name}`;
  }
  if (quantityString.substring(quantityString.length - 3, quantityString.length) === " + ") {
    quantityString = quantityString.substring(0, quantityString.length - 3);
  }
  if (addToTaste) {
    return `${sameIngredientList[0].name} (${quantityString})*`;
  }
  return `${sameIngredientList[0].name} (${quantityString})`;
}