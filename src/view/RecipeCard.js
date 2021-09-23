import React, { useState, useContext } from "react";
import { List, Card, Grid, Icon, Loader, Button, Label } from "semantic-ui-react";
import { ServerRequestContext } from "../ServerRequestContext";
import { deleteRecipe } from "../serviceCalls";
import { defaultTags } from "../edit/Tags";
import { findIndex } from "lodash";

function RecipeCard({
  recipe, 
  refreshRecipesAfterDelete, 
  onEditRecipe
 }) {

  const {
    recipeName,
    userName,
    cookTime,
    prepTime,
    author,
    calories,
    _id: recipeId,
    ingredients,
    steps,
    servings,
  } = recipe;

  const tags = recipe.tags || [];

  const [stepsVisible, setStepsVisible] = useState(false)
  const [ingredientsVisible, setIngredientsVisible] = useState(false)
  const [recipeLoading, setRecipeLoading] = useState(false);

  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);

  const onDeleteRecipe = async () => {
    setRecipeLoading(true);
    const response = await deleteRecipe(recipeId, serverState.accessToken);
    if (response.status === 204) {
      serverDispatch({ type: 'DELETE_SUCCESS', payload: { recipeName: recipe.recipeName } });
      refreshRecipesAfterDelete();
    } else if (response.status === 401 || response.status === 403) {
      serverDispatch({ type: 'LOGOUT_SUCCESS' });
    } else {
      serverDispatch({ type: 'DELETE_FAILURE' });
    }
    setRecipeLoading(false);
  }

  const getIngredientEntry = (name, amount, measurement) => {
    if (!measurement && amount) {
      return `${amount} ${name}`;
    } else if (!measurement && !amount) {
      return `some ${name}`;
    }
    return `${amount} ${measurement} of ${name}`;
  }

  const createBasketButton = () => {
    if(findIndex(serverState.basket, basketItem => recipe._id === basketItem._id) !== -1){
      return(<Button size='mini' color='orange' 
        onClick={() => serverDispatch({ type: 'REMOVE_BASKET', payload: { basketItem: recipe } })}>
        <Icon name="minus" />
        Remove From Basket
      </Button>);
    }
    return(<Button size='mini' color='orange' inverted 
      onClick={() => serverDispatch({ type: 'ADD_BASKET', payload: { basketItem: recipe } })}>
      <Icon name="plus" />
      Add To Basket
    </Button>);
  }

  const createIngredients = () => {
    if (ingredientsVisible) {
      return (
        <Grid.Row>
          <Grid.Column>
            <h4>
              <p style={{ cursor: 'pointer' }}
                onClick={() => setIngredientsVisible(false)}>
                <Icon name="minus" color='orange' ></Icon>
                {"\tIngredients"}
              </p>
            </h4>
            <List bulleted>
              {ingredients.map((ingredient) => (
                <List.Item key={"ingredient-" + ingredient.name + recipeId}>
                  {getIngredientEntry(ingredient.name, ingredient.amount, ingredient.measurement)}
                </List.Item>
              ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      )
    }
    return (
      <Grid.Row>
        <Grid.Column>
          <h4>
            <p style={{ cursor: 'pointer' }}
              onClick={() => setIngredientsVisible(true)}>
              <Icon name="plus" color='orange' ></Icon>
              {"\tIngredients ..."}
            </p>
          </h4>
        </Grid.Column>
      </Grid.Row>
    );
  }

  const createSteps = () => {
    if (stepsVisible) {
      return (
        <Grid.Row>
          <Grid.Column>
            <h4>
              <p style={{ cursor: 'pointer' }}
                onClick={() => setStepsVisible(false)}>
                <Icon name="minus" color='orange' ></Icon>
                {"\tSteps"}</p>
            </h4>
            <List ordered>
              {steps.map((step) => (
                <List.Item key={"step-text-" + step.number + recipeId}>{step.text}</List.Item>
              ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      )
    }
    return (
      <Grid.Row>
        <Grid.Column>
          <h4>
            <p style={{ cursor: 'pointer' }}
              onClick={() => setStepsVisible(true)}>
              <Icon name="plus" color='orange' ></Icon>
              {"\tSteps ..."}
            </p>
          </h4>
        </Grid.Column>
      </Grid.Row>
    );
  }

  return (
    <Card fluid color="orange">
      <Card.Content>
        <Card.Header>
          <Grid>
            <Grid.Row columns="equal">
              <Grid.Column>{recipeName}</Grid.Column>
              <Grid.Column textAlign="right">
              {(!recipeLoading && (userName === serverState.userName)) &&
                (<>
                <Button size='mini' color='orange' inverted
                  onClick={() => onEditRecipe(recipe)}>
                    <Icon name="pencil" />
                    Edit
                </Button>
                <Button size='mini' color='orange' inverted
                  onClick={() => onDeleteRecipe(recipe)}>
                    <Icon name="trash" />
                    Delete
                </Button></>)
              }
              {createBasketButton()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Header>
        {!recipeLoading && <Grid>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Card.Meta>
                <div>By {author}</div>
                {(calories !== null && calories !== 0) && <div>{calories} kCal/Serving</div>}
              </Card.Meta>
            </Grid.Column>
            <Grid.Column >
              <Card.Meta textAlign='right'>
                <div floated='right'>Total Time: {cookTime + prepTime} min</div>
                <div style={{ marginRight: '0.3em' }}>Servings: {servings}</div>
              </Card.Meta>
            </Grid.Column>
          </Grid.Row>
        </Grid>}
        {recipeLoading ?
          <Loader active inline='centered' size='massive' /> :
          <Grid>
            {createIngredients()}
            {createSteps()}
          </Grid>
        }
      </Card.Content>
      <Card.Content extra>
        <Grid>
          <Grid.Row>
            <Grid.Column floated='left' textAlign='left' width={4}>
              <>Submitted by {userName}</>
            </Grid.Column>
            <Grid.Column floated='right' textAlign='right' width={12}>
            {defaultTags
              .filter(tag => tags.includes(tag))
              .map(tag => 
                (<Label style={{margin:'5px 0px 5px 20px'}} tag color='orange'>
                  {tag}
                </Label>)
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card >
  );
}

export default RecipeCard;
