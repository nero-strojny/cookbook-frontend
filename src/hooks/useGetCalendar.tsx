import { useQuery } from "@tanstack/react-query";
import { is2xxStatus, SERVER_URL } from "./utility";
import { Calendar } from "../types/Calendar";
import { useSnackbar } from "../context/SnackbarContext";
import { useUser } from "../context/UserContext";

const createCalendar = async (startDate: string, token: string | null) => {
  const response = await fetch(`${SERVER_URL}/api/calendar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application',
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({startDate}),
  })
  return await response.json()
}

export const useGetCalendar = (startDate: string) => {
  const {showSnackbar} = useSnackbar()
  const {clearToken, token} = useUser()
  return useQuery({
    queryKey: ['getCalendar', startDate],
    enabled: !!token,
    queryFn: async (): Promise<Calendar> => {
      const response = await fetch(`${SERVER_URL}/api/calendar?startDate=${startDate}`, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          }
      })
      if (response.status === 401) {
        clearToken()
        throw new Error('Unauthorized')
      } else if (response.status === 404) {
        return await createCalendar(startDate, token)
      } else if (!is2xxStatus(response.status)) {
        showSnackbar('Error getting calendar', 'error')
        throw Error(JSON.stringify(response))
      } else {
        return await response.json()
      }
    },
  })
}