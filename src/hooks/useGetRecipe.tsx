import { useQuery } from "@tanstack/react-query"
import { Recipe } from "../types/Recipe";
import { is2xxStatus, SERVER_URL } from "./utility";
import { useUser } from "../context/UserContext";
import { useSnackbar } from "../context/SnackbarContext";

export const useGetRecipe = (recipeId?: string) => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useQuery({
    queryKey: ['getRecipe', recipeId],
    enabled: !!token && !!recipeId,
    queryFn: async (): Promise<Recipe> => {
      const response = await fetch(`${SERVER_URL}/api/recipe/${recipeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application', 
          'Authorization': 'Bearer '+ token
        },
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error getting recipe', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}