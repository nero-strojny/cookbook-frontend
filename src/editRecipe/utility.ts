import { Ingredient } from "../types/Recipe";

export const measurementVariations: string[] = [
  // Volume Measurements
  'ml', 'mL', 'milliliter', 'millilitre', 'cc',
  'l', 'L', 'liter', 'litre',
  'dl', 'dL', 'deciliter', 'decilitre',
  'teaspoon', 't', 'tsp.', 'tsp',
  'tablespoon', 'T', 'tbl.', 'tbs.', 'tbsp.', 'tbl', 'tbs', 'tbsp',
  'fl oz', 'fluid ounce',
  'gill',
  'cup', 'c',
  'pint', 'p', 'pt', 'fl pt',
  'quart', 'q', 'qt', 'fl qt',
  'gallon', 'g', 'gal',

  // Mass/Weight Measurements
  'mg', 'milligram', 'milligramme',
  'g', 'gram', 'gramme',
  'kg', 'kilogram', 'kilogramme',
  'pound', 'lb',
  'ounce', 'oz'
];

const isNumber = (value: string): boolean => {
  // Using parseFloat and isNaN
  if (isNaN(parseFloat(value))) {
    return false;
  }
  return true;
}

const isMeasurement = (value: string): boolean => {
  return measurementVariations.includes(value)
}

export const parseIngredient = (ingredientString: string): Partial<Ingredient> => {
  const values = ingredientString.split(' ')

  const [amount, measurement] = values
  if (isNumber(amount)) {
    if (isMeasurement(measurement)) { // Common case of "amount measurement name", 
      const name = values.slice(2).join(' ')
      return {name, amount: parseFloat(amount), measurement}
    }
    else {
      const name = values.slice(1).join(' ') // Case of "amount name"
      return {name, amount: parseFloat(amount)}
    }
  } else { // Case of "name"
    return { name: values.join(' ') }
  }
}

export const parseStep = (step: string): { number: number, text: string } => {
  // Regular expression to capture the step number and the remaining text
  const regex = /^(\d+)\.?\s*(.*)$/;
  const match = step.trim().match(regex);

  if (match) {
    const number = parseInt(match[1], 10);
    const text = match[2].trim();
    
    return { number, text };
  }

  return {number: 0, text: step}; // Return null if it doesn't match the expected format
}