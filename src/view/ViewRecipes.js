import React, { useEffect, useState, useContext } from "react";
import { Grid, Button, Icon, Card, Transition, Loader, Pagination } from "semantic-ui-react";
import RecipeCard from "./RecipeCard";
import { getRecipes, getRandomRecipes, defaultPaginatedRequest } from "../serviceCalls";
import SearchSection from "./SearchSection";
import { ServerRequestContext } from "../ServerRequestContext";
import { get } from 'lodash';

function ViewRecipes({
  onCreateRecipe,
  onEditRecipe,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState("");
  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  
  const PAGESIZE = defaultPaginatedRequest.pageSize;

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent) {
        if (serverState.shouldRefresh) {
          window.scrollTo(0, 0);
          const response = await getRecipes(serverState.paginatedRequest, serverState.accessToken);
          if (response.status === 200) {
            setErrorState(false);
            serverDispatch({ type: 'QUERY_RECIPES_SUCCESS', payload: { recipes: response.data.recipes, numberOfRecipes: response.data.numberOfRecipes } });
            if (!response.data.recipes || response.data.recipes.length < 1) {
              setErrorState("No Recipes Found");
            }
          } else if (response.status === 401 || response.status === 403) {
            serverDispatch({ type: 'LOGOUT_SUCCESS' });
          } else {
            setErrorState("Error Retrieving Recipes");
            serverDispatch({ type: 'QUERY_RECIPES_FAILED' });
          }
          setIsLoading(false);
        }
      }
    })();
    return () => {
      isCurrent = false
    }
  }, [currentPage, serverState.accessToken, serverDispatch, serverState.shouldRefresh, serverState.paginatedRequest]);


  function refreshRecipesAfterDelete() {
    setIsLoading(true);
    serverDispatch({ type: 'QUERY_RECIPES_PENDING', payload: { paginatedRequest: defaultPaginatedRequest } });
  }

  function refreshAndClearError(){
    setErrorState("");
    serverDispatch({ type: 'QUERY_RECIPES_PENDING', payload: { paginatedRequest: defaultPaginatedRequest } });
  }

  async function generateRandomRecipes() {
    setIsLoading(true);
    const response = await getRandomRecipes(serverState.accessToken, PAGESIZE);
    if (response.status === 200 ) {
      setErrorState("");
      serverDispatch({ type: 'QUERY_RECIPES_SUCCESS', payload: { recipes: response.data, numberOfRecipes: PAGESIZE } });
    } else if (response.status === 401 || response.status === 403) {
      serverDispatch({ type: 'LOGOUT_SUCCESS' });
    } else {
      setErrorState("Error Retrieving Recipes");
      serverDispatch({ type: 'QUERY_RECIPES_FAILED' });
    }
    setIsLoading(false);
  }

  async function switchPage(activePage){
    setCurrentPage(activePage);
    serverDispatch({
      type: 'QUERY_RECIPES_PENDING',
      payload: { 
        paginatedRequest: {
          pageSize: PAGESIZE,
          pageCount: activePage-1,
          queryRecipe: get(serverState, "paginatedRequest.queryRecipe", {})
        }
      }
    });
  }

  return (
    <Grid padded>
      <Grid.Row columns="equal">
        <Grid.Column>
          <SearchSection
            setIsLoading={setIsLoading}
            setCurrentPage={setCurrentPage}
          />
        </Grid.Column>
        <Grid.Column textAlign="right">
          <Button color="orange" onClick={() => onCreateRecipe()}>
            <Icon name="plus" />
            New Recipe
          </Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <>
            <Button
              size='small'
              compact
              loading={isLoading || serverState.shouldRefresh}
              basic
              content='Refresh'
              icon='refresh'
              labelPosition='left'
              onClick={() => refreshAndClearError()}
            />
            <Button
              size='small'
              compact
              loading={isLoading || serverState.shouldRefresh}
              basic
              content='Random'
              icon='random'
              labelPosition='left'
              onClick ={()=> generateRandomRecipes()}
            />
          </>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          {errorState !== ""  && <h1>{errorState}</h1>}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          {isLoading || serverState.shouldRefresh ?
            <Loader active inline='centered' disabled={false} size='huge'>Loading Recipes...</Loader> :
            <Card.Group itemsPerRow={1}>
              <Transition.Group
                duration={1500}
              >
                {serverState.recipes.map((r) => (
                  <RecipeCard
                    recipe={r}
                    refreshRecipesAfterDelete={refreshRecipesAfterDelete}
                    onEditRecipe={onEditRecipe}
                    key={"recipeCard" + r._id}
                  />
                ))}
              </Transition.Group>
            </Card.Group>
          }
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
      <Grid.Column>
        <Pagination 
          defaultActivePage={1} 
          totalPages={Math.ceil(serverState.numberOfRecipes/PAGESIZE) || 1} 
          firstItem={null}
          lastItem={null}
          pointing
          secondary
          activePage={currentPage}
          onPageChange={(e, { activePage })=>switchPage(activePage)}
          style={{marginBottom: '40px'}}
        />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ViewRecipes;
