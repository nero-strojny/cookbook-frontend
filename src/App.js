import React, { useEffect, useReducer } from 'react'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import CookbookApp from "./CookbookApp";
import Login from "./Login";
import { serverRequestReducer } from './reducers/serverRequestReducer';
import { ServerRequestContext } from './ServerRequestContext';
import { defaultPaginatedRequest, getRandomRecipes } from "./serviceCalls";

function App() {
  const [state, dispatch] = useReducer(serverRequestReducer, {});

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent) {
        const localStorageAccessToken = localStorage.getItem("accessToken");
        const localStorageUserName = localStorage.getItem("userName");
        if(localStorageAccessToken && localStorageUserName) {
          const response = await getRandomRecipes(localStorageAccessToken, defaultPaginatedRequest.pageSize);
          if (response.status === 200) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { userName: localStorageUserName, accessToken: localStorageAccessToken } });
          }
        }
      }
    })();
    return () => {
      isCurrent = false
    }
  }, []);

  return (
    <ServerRequestContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Switch>
        {
          state.accessToken === "" ?
            (
              <><Route path="/login" exact>
                <Login />
              </Route>
                <Redirect to="/login" /></>
            ) :
            (
              <><Route path="/cookbook" exact>
                <CookbookApp />
              </Route>
                <Route path="/login" exact>
                  <Login />
                </Route>
                <Redirect to="/cookbook" /></>
            )
        }
      </Switch>
    </BrowserRouter>
    </ServerRequestContext.Provider>
  )
}

export default App
