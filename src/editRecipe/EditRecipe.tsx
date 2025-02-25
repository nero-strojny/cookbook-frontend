import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";
import { RecipePayload } from "../hooks/useCreateRecipe";
import { useEditRecipe } from "../hooks/useEditRecipe";
import { useGetRecipe } from "../hooks/useGetRecipe";
import { FormDataType, NewRecipe } from "./NewRecipe";
import { Recipe } from "../types/Recipe";

export const EditRecipe = () => {
  const {showSnackbar} = useSnackbar()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data } = useGetRecipe(id)
  const recipe = data as Recipe;
  const editRecipeMutation = useEditRecipe(id)
  const defaultFormData: FormDataType = {
    ...recipe,
    steps: recipe.steps.map(step => `${step.number}. ${step.text}`).join('\r\n')
  }

  const editRecipeFunction = async (payload:RecipePayload) => {
    const response = await editRecipeMutation.mutateAsync({recipe:payload})
    showSnackbar('Recipe edited')
    navigate(`/recipe/${response._id}`)
  }

  return (<NewRecipe overrideAPICall={editRecipeFunction} defaultFormData={defaultFormData}/>)
    
}