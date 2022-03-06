import React, {useState} from "react";
import {Grid, Icon, List} from "semantic-ui-react"
import {Step} from "../types/step";

type StepsListProps = {
  steps: Step[];
  recipeId?: string;
}

const StepsList = ({steps, recipeId}: StepsListProps): JSX.Element => {

  const [stepsVisible, setStepsVisible] = useState<boolean>(false);

  return stepsVisible ? (
      <Grid.Row>
        <Grid.Column>
          <h4>
            <p style={{cursor: 'pointer'}}
               onClick={() => setStepsVisible(false)}>
              <Icon name="minus" color='orange'></Icon>
              {"\tSteps"}</p>
          </h4>
          <List ordered>
            {steps.map((step) => (
              <List.Item key={"step-text-" + step.number + recipeId}>{step.text}</List.Item>
            ))}
          </List>
        </Grid.Column>
      </Grid.Row>
    ) :
    (
      <Grid.Row>
        <Grid.Column>
          <h4>
            <p style={{cursor: 'pointer'}}
               onClick={() => setStepsVisible(true)}>
              <Icon name="plus" color='orange'></Icon>
              {"\tSteps ..."}
            </p>
          </h4>
        </Grid.Column>
      </Grid.Row>
    );
}

export default StepsList;