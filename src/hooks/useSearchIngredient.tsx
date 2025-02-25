import { useMutation } from "@tanstack/react-query";
import { is2xxStatus, SERVER_URL } from "./utility";
import { Ingredient } from "../types/Recipe";
import { useSnackbar } from "../context/SnackbarContext";
import { useUser } from "../context/UserContext";

export const useSearchIngredient = () => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useMutation({
    mutationFn: async ({prefix}:{prefix: string}): Promise<Ingredient[]> => {
      const response = await fetch(`${SERVER_URL}/api/ingredients?prefixIngredient=${prefix}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application',
          "Authorization": `Bearer ${token}`,
        },
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error adding ingredient', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}

