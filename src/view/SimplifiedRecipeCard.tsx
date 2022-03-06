import React from "react";
import {Card, Grid, Label, Loader} from "semantic-ui-react";
import {defaultTags} from "../edit/Tags";
import {Recipe} from "../types/recipe";
import IngredientsList from "./IngredientsList";
import StepsList from "./StepsList";

type RecipeCardProps = {
  recipe: Recipe,
  showRecipeDetails?: boolean;
  loading?: boolean;
}

const SimplifiedRecipeCard = ({
                                recipe,
                                showRecipeDetails,
                                loading
                              }: RecipeCardProps): JSX.Element => {

  const {
    _id: recipeId,
    recipeName,
    userName,
    cookTime,
    prepTime,
    author,
    calories,
    servings,
    steps,
    ingredients
  } = recipe;

  const tags = recipe.tags || [];

  return (
    <Card fluid>
      <Card.Content>
        {loading ?
          <Loader active inline='centered'/> :
          <Card.Header>{recipeName}</Card.Header>
        }
        <Card.Description>
          {(showRecipeDetails && !loading) && <Grid>
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
            <Grid>
              <IngredientsList ingredients={ingredients} recipeId={recipeId}/>
              <StepsList steps={steps} recipeId={recipeId}/>
            </Grid>
          </Grid>}
        </Card.Description>
      </Card.Content>
      {(showRecipeDetails && !loading) && <Card.Content extra>
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
                    size='mini'
                    color='orange'
                    key={`tag-${tag}`}>
                    {tag}
                  </Label>)
                )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>}
    </Card>
  )
}

export default SimplifiedRecipeCard;
