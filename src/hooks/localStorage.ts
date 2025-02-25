export type Token = {
  accessToken: string
  accessUser: string
}
export const setData = (value: Token) => {
  if (!value) {
    window.localStorage.removeItem("tasty-boi-user-token");
    window.localStorage.removeItem("tasty-boi-user");
  } else {
    window.localStorage.setItem("tasty-boi-user-token", value.accessToken);
    window.localStorage.setItem("tasty-boi-user", value.accessUser);
  }
}

export const getData = () => {
  const accessToken = window.localStorage.getItem("tasty-boi-user-token");
  const accessUser = window.localStorage.getItem("tasty-boi-user");
  return {accessToken, accessUser}
}