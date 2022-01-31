import React, { useContext } from "react";
import { Button, Card, Grid, Header, Icon, Segment, SemanticWIDTHSNUMBER } from "semantic-ui-react";
import { ServerRequestContext } from "../context/ServerRequestContext";

const SelectedRecipesSegment = ({width}:{width:number}) => {
  const { state, dispatch } = useContext(ServerRequestContext);
  const recipes = state.basket;

  let recipeCardsPerRow: SemanticWIDTHSNUMBER = 1;
  if (width > 1100) {
    recipeCardsPerRow = 7;
  } else if (width > 900){
    recipeCardsPerRow = 5;
  } else if (width > 700) {
    recipeCardsPerRow = 4;
  } else if (width > 500) {
    recipeCardsPerRow = 3;
  }

  return (
    <Segment style={{
      border: '1px solid lightgrey',
      borderRadius:'5px',
      textAlign: 'left'
      }} basic>
      <Grid>
        <Grid.Row>
          <Grid.Column width={5}>
            <Header as='h3'>Selected Recipes</Header>
          </Grid.Column>
          <Grid.Column width={5} floated='right' textAlign='right'>
            <Button color="orange" onClick={() => dispatch({ type: 'EMPTY_BASKET', payload: {} })}>
              Remove All
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1} style={{margin:'15px'}}>
          <Grid.Column width={16}>
            <Card.Group itemsPerRow={recipeCardsPerRow}>
              {recipes.map(recipe => <Card link>
                <Card.Content>
                  <Card.Description>
                    <Header as='h4'>
                      {recipe.recipeName}
                    </Header>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button size='mini' color='orange' inverted fluid
                    onClick={() => dispatch({ type: 'REMOVE_BASKET', payload: { basketItem: recipe } })}>
                    <Icon name="trash" />
                    Remove
                  </Button>
                </Card.Content>
              </Card>)}
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  )
}

export default SelectedRecipesSegment;