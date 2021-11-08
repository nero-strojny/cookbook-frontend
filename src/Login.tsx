import React, { useState, useContext, useReducer } from "react";
import { Card, Form, Transition, Message, Tab, Menu, Icon, Checkbox, Modal, Header } from "semantic-ui-react";
import { login, signup } from "./serviceCalls";
import { get } from 'lodash';
import { ServerRequestContext } from './context/ServerRequestContext';
import { useHistory } from 'react-router-dom'

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

const loginReducer = (state: LoginState, action: LoginAction): LoginState =>  {
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [{error, loading, message}, loginDispatch] = useReducer(loginReducer, {message: "", error: false, loading: false});

  let history = useHistory();
  
  const { dispatch: serverDispatch } = useContext(ServerRequestContext);

  const handleSubmitLogin = async () => {
    try {
      loginDispatch({ type: 'LOADING', payload: {} });
      const response = await login(username, password);
        localStorage.setItem('accessToken', get(response, 'data.accessToken'));
        localStorage.setItem('userName', username);
        serverDispatch({ type: 'LOGIN_SUCCESS', payload: { userName: username, accessToken: response.data.accessToken } });
        history.push("/viewRecipes");
    }
    catch (err) {
      loginDispatch({ type: 'FAILURE', payload: {message: "Invalid username or password"} });
    }
  }
  
  const handleSubmitSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      loginDispatch({ type: 'FAILURE', payload: {message: "Please fill in all fields"} });
    } else if (password !== confirmPassword) {
      loginDispatch({ type: 'FAILURE', payload: {message: "Password fields do not match"} });
    } else if (!agree){
      loginDispatch({ type: 'FAILURE', payload: {message: "Please read and agree to the terms and conditions"} });
    } else {
      try {
        loginDispatch({ type: 'LOADING', payload: {} });
        const response = await signup(username, password, email, agree);
        loginDispatch({ type: 'SUCCESS', payload: {message: `User ${response.data } successfully created! Please log in`} });
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
      catch (err) {
        loginDispatch({ type: 'FAILURE', payload: {message: get(err, 'response.data')} });
      }
    }
  }

  const panes = [
    { menuItem: 'Log in', render: () =>
      <Tab.Pane>
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
          <Form.Button color='orange'  type='submit' loading={loading}>Submit</Form.Button>
        </Form>
      </Tab.Pane> },
    { menuItem: 'Sign Up', render: () =>
      <Tab.Pane>
        <Form onSubmit={async () => handleSubmitSignUp()}>
          <Form.Field>
            <input
              placeholder='Email'
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="current-password"
            />
          </Form.Field>
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
          <Form.Field>
            <input
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="current-password"
            />
          </Form.Field>
          <Form.Field>
            <Checkbox onChange={()=>setAgree(!agree)} style={{marginRight:'5px'}}/>
            <div style={{display:'inline'}}>
              I agree to the
              <div style={{display:'inline', color: 'blue', cursor: 'pointer'}}
                onClick={()=>setOpenModal(true)}> Terms and Conditions
              </div>
            </div>
          </Form.Field>
          <Form.Button color='orange'  type='submit' loading={loading}>Submit</Form.Button>
        </Form>
      </Tab.Pane> },
  ]

  return (
    <>
      <Menu inverted color="orange" icon='labeled'>
        <Menu.Item>
          <h1 style={{fontFamily:'Marck Script'}}><Icon name="food" size="small" />TastyBoi</h1>
        </Menu.Item>
      </Menu>
      <Transition visible={message !== ""} animation="scale" duration={500}>
        <Message
          negative={error}
          onDismiss={() => loginDispatch({ type: 'CLEAR', payload: {} })}
          header={error ? "Error" : "Success!"}
          content={message}
        />
      </Transition>
      <Card style={{ marginTop: "5%", width: '60%' }} centered color="orange">
        <Card.Content>
        <Tab panes={panes} />
        </Card.Content>
      </Card >
      <Modal
        open={openModal}
        size={"small"}
        onClose={()=>setOpenModal(false)}
        actions={[{ key: 'done', content: 'Done', positive: true }]}
      >
        <Header>Terms And Conditions</Header>
        <Modal.Content>
        <p>This app is only for cool guys, I agree to this binding contract promising I am a cool guy</p>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default Login;
