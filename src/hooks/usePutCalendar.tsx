import { useMutation } from "@tanstack/react-query"
import { Recipe } from "../types/Recipe"
import { is2xxStatus, SERVER_URL } from "./utility"
import { useSnackbar } from "../context/SnackbarContext"
import { useUser } from "../context/UserContext"

export type CalendarPayload = {[key:string]:Recipe | string}

export const usePutCalendar = () => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useMutation({
    mutationFn: async ({calendar}: {calendar: CalendarPayload}) => {
      const response = await fetch(`${SERVER_URL}/api/calendar/${calendar._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(calendar),
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error creating calendar', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}