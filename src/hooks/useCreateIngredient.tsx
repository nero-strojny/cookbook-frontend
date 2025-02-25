import { useMutation } from "@tanstack/react-query";
import { is2xxStatus, SERVER_URL } from "./utility";
import { Ingredient } from "../types/Recipe";
import { useSnackbar } from "../context/SnackbarContext";
import { useUser } from "../context/UserContext";

export const useCreateIngredient = () => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useMutation({
    mutationFn: async ({ingredient}:{ingredient: Ingredient}): Promise<Ingredient> => {
      const response = await fetch(`${SERVER_URL}/api/ingredient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(ingredient),
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error creating ingredient', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}
