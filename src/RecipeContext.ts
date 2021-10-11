import { createContext } from 'react';
import { EditRecipeAction } from './reducers/EditRecipeAction';
import { defaultRecipe, EditRecipeState } from './reducers/EditRecipeState';

export const RecipeContext = createContext<{
  state: EditRecipeState;
  dispatch: React.Dispatch<EditRecipeAction>;
  }>({
      state: defaultRecipe,
      dispatch: () => undefined,
  });