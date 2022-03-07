import {createContext} from 'react';
import {EditRecipeAction} from '../reducers/EditRecipeAction';
import {defaultRecipeState, EditRecipeState} from '../reducers/EditRecipeState';

export const RecipeContext = createContext<{
  state: EditRecipeState;
  dispatch: React.Dispatch<EditRecipeAction>;
}>({
  state: defaultRecipeState,
  dispatch: () => undefined,
});