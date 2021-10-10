import { createContext } from 'react';
import { EditRecipeActionType } from './reducers/EditRecipeActions';
import { defaultRecipe, EditRecipeState } from './reducers/EditRecipeState';

export const RecipeContext = createContext<{
  state: EditRecipeState;
  dispatch: React.Dispatch<EditRecipeActionType>;
  }>({
      state: defaultRecipe,
      dispatch: () => undefined,
  });