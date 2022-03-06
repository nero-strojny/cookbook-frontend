import React, {useContext, useState} from "react";
import {Button, Card, Grid, Icon, Label, Loader} from "semantic-ui-react";
import {ServerRequestContext} from "../context/ServerRequestContext";
import {deleteRecipe} from "../serviceCalls";
import {defaultTags} from "../edit/Tags";
import {findIndex} from "lodash";
import {Recipe} from "../types/recipe";
import {useHistory} from "react-router";
import IngredientsList from "./IngredientsList";
import StepsList from "./StepsList";

type RecipeCardProps = {
  recipe: Recipe
}

const RecipeCard = ({recipe}: RecipeCardProps): JSX.Element => {

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

  const history = useHistory();

  const [recipeLoading, setRecipeLoading] = useState<boolean>(false);

  const {state: serverState, dispatch: serverDispatch} = useContext(ServerRequestContext);

  const onDeleteRecipe = async () => {
    setRecipeLoading(true);
    if (recipeId) {
      const response = await deleteRecipe(recipeId, serverState.accessToken);
      if (response.status === 204) {
        serverDispatch({
          type: 'SHOW_MESSAGE',
          payload: {messageContent: `Recipe, "${recipe.recipeName}", has been deleted`, success: true}
        });
      } else if (response.status === 401 || response.status === 403) {
        serverDispatch({type: 'LOGOUT_SUCCESS', payload: {}});
      } else {
        serverDispatch({
          type: 'SHOW_MESSAGE',
          payload: {messageContent: `There was an error in deleting the recipe`, success: false}
        });
      }
      setRecipeLoading(false);

    }
  }

  const createBasketButton = () => {
    if (findIndex(serverState.basket, basketItem => recipe._id === basketItem._id) !== -1) {
      return (<Button size='mini' color='orange'
                      onClick={() => serverDispatch({type: 'REMOVE_BASKET', payload: {basketItem: recipe}})}>
        <Icon name="minus"/>
        Basket
      </Button>);
    }
    return (<Button size='mini' color='orange' inverted
                    onClick={() => serverDispatch({type: 'ADD_ALL_BASKET', payload: {basketItems: [recipe]}})}>
      <Icon name="plus"/>
      Basket
    </Button>);
  }


  return (
    <Card fluid color="orange">
      <Card.Content>
        <Card.Header>
          <Grid>
            <Grid.Row>
              <Grid.Column width={7}>
                <p style={{cursor: 'pointer', textDecoration: 'underline'}}
                   onClick={() => serverDispatch({
                     type: 'QUERY_RECIPES_PENDING',
                     payload: {
                       paginatedRequest: {
                         pageSize: 1, pageCount: 0,
                         queryRecipe: {recipeName}
                       }
                     }
                   })}>
                  {recipeName}
                </p>
              </Grid.Column>
              <Grid.Column width={9} textAlign="right">
                {(!recipeLoading && (userName === serverState.userName)) &&
                  (<>
                    <Button size='mini' color='orange' inverted
                            onClick={() => {
                              history.push(`/editRecipes/${recipeId}`);
                            }}>
                      <Icon name="pencil"/>
                      Edit
                    </Button>
                    <Button size='mini' color='orange' inverted
                            onClick={() => onDeleteRecipe()}>
                      <Icon name="trash"/>
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
            <Grid.Column>
              <Card.Meta textAlign='right'>
                <div>Total Time: {cookTime + prepTime} min</div>
                <div style={{marginRight: '0.3em'}}>Servings: {servings}</div>
              </Card.Meta>
            </Grid.Column>
          </Grid.Row>
        </Grid>}
        {recipeLoading ?
          <Loader active inline='centered' size='massive'/> :
          <Grid>
            <IngredientsList ingredients={ingredients} recipeId={recipeId}/>
            <StepsList steps={steps} recipeId={recipeId}/>
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
                  (<Label
                    style={{margin: '5px 0px 5px 20px'}}
                    tag
                    color='orange'
                    key={`tag-${tag}-${recipeId}`}>
                    {tag}
                  </Label>)
                )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}

export default RecipeCard;
