import { useMutation } from "@tanstack/react-query"
import { is2xxStatus, SERVER_URL } from "./utility"
import { Ingredient, Recipe } from "../types/Recipe"
import { useSnackbar } from "../context/SnackbarContext"
import { useUser } from "../context/UserContext"

export type RecipePayload = {
  author: string,
  prepTime: number,
  cookTime: number,
  calories: number,
  servings: number,
  tags: string[],
  ingredients: Ingredient[],
  steps: {number:number, text:string}[]
}

export const useCreateRecipe = () => {
  const {showSnackbar} = useSnackbar()
  const { clearToken, token, user } = useUser()
  return useMutation({
    mutationFn: async ({recipe}:{recipe: RecipePayload}): Promise<Recipe> => {
      const response = await fetch(`${SERVER_URL}/api/recipe`, {
        method: 'POST',
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
        showSnackbar('Error creating recipe', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}
