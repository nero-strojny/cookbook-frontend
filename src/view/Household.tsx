import {Form, Grid} from "semantic-ui-react";
import React, {useReducer} from "react";
import {editHouseholdReducer} from "../reducers/editHouseholdReducer";
import {defaultHouseholdState} from "../reducers/EditHouseholdState";

const Household = (): JSX.Element => {

    const [state, dispatch] = useReducer(editHouseholdReducer, defaultHouseholdState)

    return (
        <Grid padded>
            <Grid.Row columns="equal">
                <Grid.Column>
                    <h1>Edit Household</h1>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row colums="equal">
                <Grid.Column>
                    <Form.Field>
                        <label>Edit Name</label>
                        <input
                            placeholder="Name"
                            value={state.name}
                            onChange={(event) =>
                                dispatch({type: 'EDIT_NAME', payload: {householdName: event.target.value}})
                            }
                        />
                    </Form.Field>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Form.Field>
                        <label>Invite User</label>
                        <input
                            placeholder="Username"
                            value={state.inviteMember}
                            onChange={(event) =>
                                dispatch({type: 'INVITE_USER', payload: {memberInvite: event.target.value}})
                            }
                            />
                    </Form.Field>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Form.Field>
                        <label>Users in household</label>
                    </Form.Field>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default Household;
