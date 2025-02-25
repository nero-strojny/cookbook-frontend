import { useMutation } from "@tanstack/react-query";
import { is2xxStatus, SERVER_URL } from "./utility";
import { useSnackbar } from "../context/SnackbarContext";
import { useUser } from "../context/UserContext";

export const useEmailBasket = () => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useMutation({
    mutationFn: async (ingredientStrings: { [category: string]: string[]}): Promise<number> => {
      const response = await fetch(`${SERVER_URL}/api/basket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(ingredientStrings),
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error creating ingredient', 'error')
        throw Error(JSON.stringify(response))
      } else {
        showSnackbar('Email sent')
        return response.status
      }
    },
  })
}
