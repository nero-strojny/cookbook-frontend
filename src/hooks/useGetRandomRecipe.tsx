import { useMutation } from "@tanstack/react-query"
import { Recipe } from "../types/Recipe";
import { is2xxStatus, SERVER_URL } from "./utility";
import { useSnackbar } from "../context/SnackbarContext";
import { useUser } from "../context/UserContext";

export const useGetRandomRecipe = (numberOfRecipes: number) => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useMutation({
    mutationFn: async (): Promise<Recipe[]> => {
      const response = await fetch(`${SERVER_URL}/api/randomRecipe/${numberOfRecipes}`, {
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