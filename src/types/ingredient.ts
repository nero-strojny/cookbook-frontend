export type Ingredient = {
  _id: string;
  name: string;
  category: string;
  amount: number;
  measurement: string;
}

export type NewIngredient = {
  name: string;
  category: string;
}