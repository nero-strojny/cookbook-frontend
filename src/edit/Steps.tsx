import React, { useContext } from "react";
import { Form, TextArea, Grid, Button, Icon } from "semantic-ui-react";
import { RecipeContext } from "../RecipeContext";

function Steps() {
  const { state, dispatch } = useContext(RecipeContext);
  const { stepsText } = state;
  const currentStepsText = stepsText || [];

  function createSteps() {
    const stepInputs = [
      <Grid.Row columns="equal" key={"stepsText0"}>
          <Grid.Column width={13}>
            <Form.Field>
              <label>{"Step 1:"}</label>
              <TextArea
                placeholder="Describe step here..."
                value={currentStepsText.length > 0 ? currentStepsText[0] : "" }
                onChange={(event) => dispatch({ 
                  type: 'EDIT_STEP',
                  payload: { indexSelected: 0, valueInput: event.target.value }
                })}
              />
            </Form.Field>
          </Grid.Column>
        </Grid.Row>
    ];
    for (let i = 1; i < currentStepsText.length; i++) {
      stepInputs.push(
        <Grid.Row columns="equal" key={"stepsText" + i}>
          <Grid.Column width={13}>
            <Form.Field>
              <label>{`Step ${i+1}:`}</label>
              <TextArea
                placeholder="Describe step here..."
                value={currentStepsText[i]}
                onChange={(event) => dispatch({ 
                  type: 'EDIT_STEP',
                  payload: { indexSelected: i, valueInput: event.target.value }
                })}
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            <Button size='mini' color='orange' inverted circular icon='x'
              onClick={() => dispatch({ 
                type: 'DELETE_STEP',
                payload: { indexSelected: i }
              })}>
            </Button>
          </Grid.Column>
        </Grid.Row>
      );
    }
    return stepInputs;
  }

  return (
    <Form>
      <Grid>
        <Grid.Row columns="equal">
          <Grid.Column>
            <h3>Steps</h3>
          </Grid.Column>
        </Grid.Row>
        {createSteps()}
        <Grid.Row>
          <Grid.Column>
            <Button onClick={() => dispatch({ type: 'ADD_STEP', payload: {} })}>
              <Icon name="plus" /> Add Step
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
}

export default Steps;