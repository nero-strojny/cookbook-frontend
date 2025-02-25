import { Ingredient, Recipe } from "../types/Recipe";

export interface IngredientString  {
  combinedString: string
  checked: boolean
  _id: string;
  name: string;
  amount?: number;
  measurement?: string;
  category: string;
  recipes: Recipe[]
}

export interface CombinedIngredient  {
  _id: string;
  name: string;
  amount?: number;
  measurement?: string;
  category: string;
  recipes: Recipe[]
}

export const combineIngredients = (recipes: Recipe[]) => {
  const ingredients: Map<string, CombinedIngredient[]>  = new Map<string, CombinedIngredient[]>()
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const currentValue = ingredients.get(ingredient.name)
      if (currentValue) {
        const tempArray = [...currentValue]
        const indexMeasurement = currentValue.findIndex(value => value.measurement === ingredient.measurement)
        if (indexMeasurement !== -1){
          tempArray[indexMeasurement] = {
            ...ingredient,
            amount: (ingredient.amount || 0) + (tempArray[indexMeasurement].amount || 0),
            recipes: [...tempArray[indexMeasurement].recipes, recipe]
          }
        }
        else {
          tempArray.push({...ingredient, recipes: [recipe]})
        }
        ingredients.set(ingredient.name, tempArray)
      } else {
        ingredients.set(ingredient.name, [{...ingredient, recipes: [recipe]}])
      }
    })
  })
  return ingredients
}


export const ingredientsToTable = (mappedIngredientGroup: Map<string, CombinedIngredient[]>) => {
  const tableIngredients: IngredientString[] = []
  for (const mappedIngredients of mappedIngredientGroup.values()) {
    const combinedIngredient = {
      ...mappedIngredients[0],
      checked: false,
      combinedString: mappedIngredients.map(ingredient => {
        if (ingredient.amount || ingredient.measurement){
          return `${ingredient.amount || ''} ${ingredient.measurement || ''}`
        } return ''
      }).filter(ingredientString => ingredientString !== '').join(' + ').trim()
    } 
    tableIngredients.push(combinedIngredient)
  }
  return tableIngredients
}


export const groupIngredientsByCategory = (mappedIngredientGroup: Map<string, Ingredient[]>) => {
  const ingredients: Map<string, IngredientString[]>  = new Map<string, IngredientString[]>()
  for (const mappedIngredients of mappedIngredientGroup.values()) {
    const currentCategory = ingredients.get(mappedIngredients[0].category)
    const combinedIngredient = {
      ...mappedIngredients[0],
      recipes: [],
      checked: false,
      combinedString: mappedIngredients.map(ingredient => {
        if (ingredient.amount || ingredient.measurement){
          return `${ingredient.amount || ''} ${ingredient.measurement || ''}`
        } return ''
      }).filter(ingredientString => ingredientString !== '').join(' + ').trim()
    } 
    if (currentCategory) {
      ingredients.set(mappedIngredients[0].category, [...currentCategory, combinedIngredient])
    } else {
      ingredients.set(mappedIngredients[0].category, [combinedIngredient])
    }
  }
  return ingredients
}

export const  categorizeIngredients = (recipes: Recipe[]) => 
  recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!acc[ingredient.category]) {
        acc[ingredient.category] = [];
      }
      acc[ingredient.category].push(ingredient.name);
    });
    return acc;
  }, {} as Record<string, string[]>);