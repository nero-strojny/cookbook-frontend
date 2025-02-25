import { useMutation } from "@tanstack/react-query"
import { is2xxStatus, SERVER_URL } from "./utility"
import { useSnackbar } from "../context/SnackbarContext"
import { useUser } from "../context/UserContext"

export const useDeleteRecipe = () => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useMutation({
    mutationFn: async ({_id}:{_id: string}) => {
      const response = await fetch(`${SERVER_URL}/api/recipe/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application',
          "Authorization": `Bearer ${token}`,
        },
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error deleting recipe', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return response.status
      }
    },
  })
}