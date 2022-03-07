import {Button, Card, Form, Grid, Message, Transition} from "semantic-ui-react";
import React, {useContext, useReducer, useState} from "react";
import {updatePassword} from "../serviceCalls";
import {useHistory} from 'react-router-dom'
import {ServerRequestContext} from "../context/ServerRequestContext";

interface ProfileState {
  message?: string;
  loading: boolean
  error: boolean
}

export type ProfileAction = {
  type: string,
  payload: {
    message?: string;
  }
}
const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case 'SUCCESS':
      return {message: action.payload.message, loading: false, error: false};
    case 'FAILURE':
      return {message: action.payload.message, loading: false, error: true};
    case 'LOADING':
      return {loading: true, error: false}
    case 'CLEAR':
      return {...state, loading: false, message: "", error: false};
    default:
      throw new Error();
  }
}

const Profile = (): JSX.Element => {
  const {state: serverState} = useContext(ServerRequestContext);
  const [{message, error, loading}, loginDispatch] = useReducer(profileReducer, {
    message: "",
    loading: false,
    error: false
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  let history = useHistory();

  const handleUpdatePassword = async () => {
    try {
      loginDispatch({type: 'LOADING', payload: {}});
      if (newPassword === confirmedPassword) {
        const response = await updatePassword(serverState.userName, currentPassword, newPassword);
        if (response.status === 400) {
          loginDispatch({type: 'FAILURE', payload: {message: "Current password is incorrect."}})
        }
      } else {
        loginDispatch({type: 'FAILURE', payload: {message: "New password does not match."}});
      }
      loginDispatch({type: 'SUCCESS', payload: {message: "Successfully updated password."}});
      setConfirmedPassword("");
      setCurrentPassword("");
      setNewPassword("");
      history.push("/profile");
    } catch (err) {
      loginDispatch({type: 'FAILURE', payload: {message: "Failed to update password"}});
    }
  }

  return (
    <>
      <Transition visible={message !== ""} animation="scale" duration={500}>
        <Message
          negative={error}
          onDismiss={() => loginDispatch({type: 'CLEAR', payload: {}})}
          header={error ? "Error" : "Success!"}
          content={message}
        />
      </Transition>
      <Card style={{marginTop: "5em", width: '25em'}} centered color="orange">
        <Card.Content>
          <Grid padded>
            <Grid.Row columns="equal">
              <Grid.Column>
                <Grid.Row>
                  <h2>Update Password</h2>
                </Grid.Row>
                <Grid.Row>
                  <Form>
                    <Form.Field>
                      <label>Old Password</label>
                      <input placeholder='Old Password'
                             type='password'
                             value={currentPassword}
                             onChange={(event) =>
                               setCurrentPassword(event.target.value)
                             }
                             autoComplete="current-password"
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>New Password</label>
                      <input placeholder='New Password'
                             type='password'
                             value={newPassword}
                             onChange={(event) =>
                               setNewPassword(event.target.value)
                             }
                             autoComplete="current-password"
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Confirm New Password</label>
                      <input placeholder='New Password'
                             type='password'
                             value={confirmedPassword}
                             onChange={(event) =>
                               setConfirmedPassword(event.target.value)
                             }
                             autoComplete="current-password"
                      />
                    </Form.Field>
                    <Button type='submit'
                            onClick={() => handleUpdatePassword()}
                            color='orange' loading={loading}
                    >Submit</Button>
                  </Form>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    </>
  );
}

export default Profile;
