import { useMutation } from "@tanstack/react-query"
import { Recipe } from "../types/Recipe"
import { is2xxStatus, SERVER_URL } from "./utility"
import { useUser } from "../context/UserContext"
import { useSnackbar } from "../context/SnackbarContext"

export type CalendarPayload = {[key:string]:Recipe | string}

export const usePutPassword = () => {
  const {clearToken} = useUser()
  const {showSnackbar} = useSnackbar()
  return useMutation({
    mutationFn: async ({userName, currentPassword, newPassword}: {userName: string, currentPassword: string, newPassword: string}) => {
      const response = await fetch(`${SERVER_URL}/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application',
        },
        body: JSON.stringify({userName, currentPassword, newPassword}),
      })
      if (!is2xxStatus(response.status)) {
        showSnackbar(`Error setting password`, 'error');
      } else {
        clearToken()
        showSnackbar('Password changed successfully')
        return response.status
      }
    }
  })
}