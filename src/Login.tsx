import React, { useState, useContext } from "react";
import { Card, Form, Transition, Message } from "semantic-ui-react";
import { login } from "./serviceCalls";
import { get } from 'lodash';
import { ServerRequestContext } from './context/ServerRequestContext';
import { useHistory } from 'react-router-dom'

const Login = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  let history = useHistory();
  
  const { dispatch: serverDispatch } = useContext(ServerRequestContext);

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await login(username, password);
      if (get(response, 'data.accessToken')) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('userName', username);
        setError(false)
        serverDispatch({ type: 'LOGIN_SUCCESS', payload: { userName: username, accessToken: response.data.accessToken } });
        history.push("/viewRecipes");
      } else {
        setError(true)
      }
      setIsLoading(false)
    }
    catch (err) {
      setError(true)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Transition visible={error} animation="scale" duration={500}>
        <Message
          negative
          onDismiss={() => setError(false)}
          header="Error"
          content={`Unknown username or password`}
        />
      </Transition>
      <Card style={{ marginTop: "5%" }} centered color="orange">
        <Card.Content>
          <Card.Header>
            Login
        </Card.Header>
        Only authorized users have access to this app.
        If you would like access, email nero.alexandraj@gmail.com.
      </Card.Content>
        <Card.Content>
          <Form onSubmit={async () => handleSubmit()}>
            <Form.Field>
              <input
                placeholder='Username'
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                autoComplete="current-password"
              />
            </Form.Field>
            <Form.Field>
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />
            </Form.Field>
            <Form.Button color='orange'  type='submit' loading={isLoading}>Submit</Form.Button>
          </Form>
        </Card.Content>
      </Card >
    </>
  );
}

export default Login;
