import { useQuery } from "@tanstack/react-query"
import { Recipe } from "../types/Recipe"
import { is2xxStatus, PAGE_SIZE, SERVER_URL } from "./utility"
import { useUser } from "../context/UserContext"
import { useSnackbar } from "../context/SnackbarContext"

type RecipeResponseType ={
  pageSize: number
  numberOfRecipes: number
  recipes: Recipe[]
}

export const useGetRecipes = (pageCount: number, recipeToFilterBy?: string, overriddenPageSize?: number) => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useQuery({
    queryKey: ['getRecipes', pageCount, recipeToFilterBy],
    enabled: !!token,
    queryFn: async (): Promise<RecipeResponseType> => {
      const response = await fetch(SERVER_URL+"/api/recipes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ pageCount, pageSize: overriddenPageSize || PAGE_SIZE, queryRecipe: { recipeName: recipeToFilterBy} }),
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error getting recipes', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}