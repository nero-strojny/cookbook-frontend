import React, { useEffect, useReducer, useState } from 'react'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import Login from "./Login";
import { serverRequestReducer } from './reducers/serverRequestReducer';
import { initialServerState } from './reducers/ServerState';
import { ServerRequestContext } from './context/ServerRequestContext';
import { defaultPaginatedRequest, getRandomRecipes } from "./serviceCalls";
import EditRecipe from './edit/EditRecipe';
import MessageBar from './MessageBar';
import Header from './Header';
import ViewRecipes from './view/ViewRecipes';
import Calendar from './calendar/Calendar';
import Basket from './basket/Basket';

const App = (): JSX.Element => {
  const localStorageAccessToken = localStorage.getItem("accessToken");
  const localStorageUserName = localStorage.getItem("userName");
  const [ state, dispatch ] = useReducer(serverRequestReducer, initialServerState);
  const [ width, setWidth ] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent) {
        if(localStorageAccessToken && localStorageUserName) {
          const response = await getRandomRecipes(localStorageAccessToken, defaultPaginatedRequest.pageSize);
          if (response.status === 200) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { userName: localStorageUserName, accessToken: localStorageAccessToken } });
          } else if(response.status === 401 || response.status === 403) {
            dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
          }
        } else {
          dispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
        }
      }
    })();
    return () => {
      isCurrent = false
    }
  }, [localStorageAccessToken, localStorageUserName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({type: 'CLEAR_MESSAGE', payload: {}});
    }, 5000);
    return () => clearTimeout(timer);
  }, [dispatch, state]);

  console.log(state);

  return (
    <ServerRequestContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Switch>
        {
          (state.accessToken || localStorage.getItem("accessToken")) === "" ?
            (
              <><Route path="/login" exact>
                <Login />
              </Route>
                <Redirect to="/login" /></>
            ) :
            (
              <>
                <Route path="/viewRecipes" exact>
                  <Header/>
                  <MessageBar/>
                  <ViewRecipes width={width}/>
                </Route>
                <Route path="/editRecipes">
                  <Header/>
                  <MessageBar/>
                  <EditRecipe/>
                </Route>
                <Route path="/basket" exact>
                  <Header/>
                  <MessageBar/>
                  <Basket />
                </Route>
                <Route path="/calendar" exact>
                  <Header/>
                  <MessageBar/>
                  <Calendar width={width} />
                </Route>
                <Route path="/login" exact>
                  <Login />
                </Route>
              </>
            )
        }
      </Switch>
    </BrowserRouter>
    </ServerRequestContext.Provider>
  )
}

export default App
