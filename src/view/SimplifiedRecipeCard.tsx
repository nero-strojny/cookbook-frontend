import React, { useState, useContext } from "react";
import { List, Card, Grid, Icon, Loader, Button, Label } from "semantic-ui-react";
import { ServerRequestContext } from "../ServerRequestContext";
import { deleteRecipe } from "../serviceCalls";
import { defaultTags } from "../edit/Tags";
import { findIndex } from "lodash";
import { Recipe } from "../types/recipe";

type RecipeCardProps = {
  recipe: Recipe,
  showRecipeDetails?: boolean;
  loading?: boolean;
}

function SimplifiedRecipeCard({
  recipe,
  showRecipeDetails,
  loading
 }: RecipeCardProps): JSX.Element {

  const {
    recipeName,
    userName,
    cookTime,
    prepTime,
    author,
    calories,
    tags,
    servings,
  } = recipe;

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
            <Grid.Column >
              <Card.Meta textAlign='right'>
                <div>Total Time: {cookTime + prepTime} min</div>
                <div style={{ marginRight: '0.3em' }}>Servings: {servings}</div>
              </Card.Meta>
            </Grid.Column>
          </Grid.Row>
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
                  style={{margin:'5px 0px 5px 20px'}} 
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
