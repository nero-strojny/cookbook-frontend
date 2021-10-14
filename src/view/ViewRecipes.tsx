import React, { useEffect, useState, useContext } from "react";
import { Grid, Button, Card, Transition, Loader, Pagination, SemanticWIDTHSNUMBER } from "semantic-ui-react";
import RecipeCard from "./RecipeCard";
import { getRecipes, getRandomRecipes, defaultPaginatedRequest } from "../serviceCalls";
import SearchSection from "./SearchSection";
import { ServerRequestContext } from "../context/ServerRequestContext";
import { get } from 'lodash';

type ViewRecipesProps = {
  width: number
}

const ViewRecipes = ({
  width
}: ViewRecipesProps): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string>("");
  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  
  const PAGESIZE = defaultPaginatedRequest.pageSize;
  const totalPages = serverState.numberOfRecipes ?
    Math.ceil(serverState.numberOfRecipes/PAGESIZE) || 1 :
    1;

  let cardsPerRow: SemanticWIDTHSNUMBER = 1;
  if (width > 1190 && serverState.recipes && serverState.recipes.length >= 3){
    cardsPerRow = 3;
  } else if (width > 790 && serverState.recipes && serverState.recipes.length >= 2) {
    cardsPerRow = 2;
  }

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent) {
        if (serverState.shouldRefresh) {
          window.scrollTo(0, 0);
          const response = await getRecipes(serverState.paginatedRequest, serverState.accessToken);
          if (response.status === 200) {
            setErrorState("");
            serverDispatch({ type: 'QUERY_RECIPES_SUCCESS', payload: { recipes: response.data.recipes, numberOfRecipes: response.data.numberOfRecipes } });
            if (!response.data.recipes || response.data.recipes.length < 1) {
              setErrorState("No Recipes Found");
            }
          } else if (response.status === 401 || response.status === 403) {
            serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
          } else {
            setErrorState("Error Retrieving Recipes");
            serverDispatch({ type: 'QUERY_RECIPES_FAILED', payload: {} });
          }
          setIsLoading(false);
        }
      }
    })();
    return () => {
      isCurrent = false
    }
  }, [currentPage, serverState.accessToken, serverDispatch, serverState.shouldRefresh, serverState.paginatedRequest]);

  const refreshAndClearError = () => {
    setErrorState("");
    serverDispatch({ type: 'QUERY_RECIPES_PENDING', payload: { paginatedRequest: defaultPaginatedRequest } });
  }

  const generateRandomRecipes = async() => {
    setIsLoading(true);
    const response = await getRandomRecipes(serverState.accessToken, PAGESIZE);
    if (response.status === 200 ) {
      setErrorState("");
      serverDispatch({ type: 'QUERY_RECIPES_SUCCESS', payload: { recipes: response.data, numberOfRecipes: PAGESIZE } });
    } else if (response.status === 401 || response.status === 403) {
      serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
    } else {
      setErrorState("Error Retrieving Recipes");
      serverDispatch({ type: 'QUERY_RECIPES_FAILED', payload: {} });
    }
    setIsLoading(false);
  }

  const switchPage = async (activePage: number | undefined) =>{
    if (activePage) {
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
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
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
            {
            (serverState.recipes && serverState.recipes.length > 0) &&
            (
              <Button
                size='small'
                compact
                loading={isLoading || serverState.shouldRefresh}
                basic
                content={`Add All (${serverState.recipes.length}) To Basket`}
                icon='plus'
                labelPosition='left'
                onClick={() => serverDispatch({ type: 'ADD_ALL_BASKET', payload: { basketItems: serverState.recipes } })}
              />
            )
          }
          </>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          {errorState !== ""  && <h1>{errorState}</h1>}
          {isLoading || serverState.shouldRefresh ?
            <Loader active inline='centered' disabled={false} size='huge'>Loading Recipes...</Loader> :
            <Card.Group itemsPerRow={cardsPerRow}>
              <Transition.Group
                duration={1500}
              >
                {serverState.recipes && serverState.recipes.map((r) => (
                  <RecipeCard
                    recipe={r}
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
          totalPages={totalPages} 
          firstItem={null}
          lastItem={null}
          pointing
          secondary
          activePage={currentPage}
          onPageChange={(e, { activePage })=>switchPage(Number(activePage))}
          style={{marginBottom: '40px'}}
        />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ViewRecipes;
