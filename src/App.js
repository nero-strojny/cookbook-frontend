import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import CookbookApp from "./CookbookApp";
import Login from "./Login";
import { getRandomRecipes } from "./serviceCalls";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent) {
        const localStorageAccessToken = localStorage.getItem("accessToken");
        if(localStorageAccessToken) {
          const response = await getRandomRecipes(localStorageAccessToken);
          if (response.status === 200) {
            setAccessToken(localStorageAccessToken);
          }
        }
      }
    })();
    return () => {
      isCurrent = false
    }
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        {
          accessToken === "" ?
            (
              <><Route path="/login" exact>
                <Login 
                  setAccessToken={setAccessToken}
                  setCurrentUser={setCurrentUser}
                />
              </Route>
                <Redirect to="/login" /></>
            ) :
            (
              <><Route path="/cookbook" exact>
                <CookbookApp 
                  token={accessToken}
                  currentUser={currentUser} 
                  setAccessToken={setAccessToken}
                />
              </Route>
                <Route path="/login" exact>
                  <Login
                    setCredentials={setAccessToken}
                    setCurrentUser={setCurrentUser}
                  />
                </Route>
                <Redirect to="/cookbook" /></>
            )
        }
      </Switch>
    </BrowserRouter>
  )
}

export default App
