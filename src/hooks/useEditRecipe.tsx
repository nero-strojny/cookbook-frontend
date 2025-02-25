import { useMutation } from "@tanstack/react-query"
import { is2xxStatus, SERVER_URL } from "./utility"
import { Recipe } from "../types/Recipe"
import { useSnackbar } from "../context/SnackbarContext"
import { useUser } from "../context/UserContext"
import { RecipePayload } from "./useCreateRecipe"

export const useEditRecipe = (_id?:string) => {
  const {showSnackbar} = useSnackbar()
  const { clearToken, token, user } = useUser()
  return useMutation({
    mutationFn: async ({recipe}:{recipe: RecipePayload}): Promise<Recipe> => {
      const response = await fetch(`${SERVER_URL}/api/recipe/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({...recipe, username:user}),
      }
    )
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error editing recipe', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}
