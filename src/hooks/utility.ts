import { isMobileOnly } from "react-device-detect";

export const SERVER_URL = 'https://tastyboi-server.com'
export const PAGE_SIZE = isMobileOnly ? 6 : 24

export const is2xxStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
}