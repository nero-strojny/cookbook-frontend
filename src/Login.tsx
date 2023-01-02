import React, {useContext, useReducer, useState} from "react";
import {Card, Form, Icon, Menu, Message, Transition} from "semantic-ui-react";
import {login} from "./serviceCalls";
import {get} from 'lodash';
import {ServerRequestContext} from './context/ServerRequestContext';
import {useHistory} from 'react-router-dom'

interface LoginState {
  error: boolean;
  message?: string;
  loading: boolean;
}

export type LoginAction = {
  type: string,
  payload: {
    message?: string;
  }
}

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case 'SUCCESS':
      return {message: action.payload.message, error: false, loading: false};
    case 'FAILURE':
      return {message: action.payload.message, error: true, loading: false};
    case 'LOADING':
      return {...state, loading: true, message: ""};
    case 'CLEAR':
      return {...state, loading: false, message: "", error: false};
    default:
      throw new Error();
  }
}

const Login = (): JSX.Element => {
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [{error, loading, message}, loginDispatch] = useReducer(loginReducer, {
    message: "",
    error: false,
    loading: false
  });

  let history = useHistory();

  const {dispatch: serverDispatch} = useContext(ServerRequestContext);

  const handleSubmitLogin = async () => {
    try {
      loginDispatch({type: 'LOADING', payload: {}});
      const response = await login(username, password);
      localStorage.setItem('accessToken', get(response, 'data.accessToken'));
      localStorage.setItem('userName', username);
      serverDispatch({type: 'LOGIN_SUCCESS', payload: {userName: username, accessToken: response.data.accessToken}});
      history.push("/viewRecipes");
    } catch (err) {
      loginDispatch({type: 'FAILURE', payload: {message: "Invalid username or password"}});
    }
  }

  return (
    <>
      <Menu inverted color="orange" icon='labeled'>
        <Menu.Item>
          <h1 style={{fontFamily: 'Marck Script'}}><Icon name="food" size="small"/>TastyBoi</h1>
        </Menu.Item>
      </Menu>
      <Transition visible={message !== ""} animation="scale" duration={500}>
        <Message
          negative={error}
          onDismiss={() => loginDispatch({type: 'CLEAR', payload: {}})}
          header={error ? "Error" : "Success!"}
          content={message}
        />
      </Transition>
      <Card style={{marginTop: "5em", width: '25em'}} centered color="orange">
        <Card.Header style={{backgroundColor:"#f2711c", color: "white"}}>
          <h1 style={{fontFamily: 'Marck Script', margin:'10px'}}>
            Login
          </h1>
        </Card.Header>
        <Card.Content>
        <Form onSubmit={async () => handleSubmitLogin()}>
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
            <Form.Button color='orange' type='submit' loading={loading}>Submit</Form.Button>
          </Form>
        </Card.Content>
      </Card>
    </>
  );
}

export default Login;
