import React, { useState, useContext } from "react";
import { List, Card, Grid, Icon, Loader, Button, Label } from "semantic-ui-react";
import { MessageBarContext } from "../MessageBarContext";
import { deleteRecipe } from "../serviceCalls";
import { defaultTags } from "../edit/Tags";

function RecipeCard({ 
  token,
  setAccessToken,
  currentUser, 
  recipe, 
  refreshRecipesAfterDelete, 
  onEditRecipe,
  onFailedDelete
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

  const { dispatch } = useContext(MessageBarContext);

  const onDeleteRecipe = async () => {
    setRecipeLoading(true);
    const response = await deleteRecipe(recipeId, token);
    if (response.status === 204) {
      dispatch({ type: 'DELETE_SUCCESS', payload: { recipeName: recipe.recipeName } });
      refreshRecipesAfterDelete();
    } else if (response.status === 401 || response.status === 403) {
      setAccessToken("")
    } else {
      dispatch({ type: 'DELETE_FAILURE' });
      onFailedDelete()
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
              {(!recipeLoading && (userName === currentUser)) &&
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
