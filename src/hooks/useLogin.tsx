import { useMutation } from "@tanstack/react-query"
import { setData } from "./localStorage"
import { is2xxStatus, SERVER_URL } from "./utility"
import { useSnackbar } from "../context/SnackbarContext"

export const useLogin = (username: string, password: string) => {
  const {showSnackbar} = useSnackbar()
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(SERVER_URL+"/api/userToken", {
        method: 'POST',
        headers: {
          'Content-Type': 'application'
        },
        body: JSON.stringify({ username, password }),
      })
      if (!is2xxStatus(response.status)) {
        showSnackbar('Error logging in', 'error')
      } else {
        const newToken = await response.json()
        setData({accessToken: newToken.accessToken, accessUser: username})
        return newToken
      }
    }
  })
}