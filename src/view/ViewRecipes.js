import React, { useEffect, useState } from "react";
import { Grid, Button, Icon, Card, Transition, Loader, Pagination } from "semantic-ui-react";
import RecipeCard from "./RecipeCard";
import { getRecipes, getRandomRecipes } from "../serviceCalls";
import SearchSection from "./SearchSection";

function ViewRecipes({ 
  token,
  setAccessToken, 
  currentUser, 
  onCreateRecipe,
  onEditRecipe,
}) {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [disablePagination, setDisablePagination] = useState(false);
  const [errorState, setErrorState] = useState("")
  const [numberOfRecipes, setNumberOfRecipes] = useState(0);
  
  const PAGESIZE = 5;

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent) {
        if (shouldRefresh) {
          window.scrollTo(0, 0)
          const response = await getRecipes({
            pageSize: PAGESIZE,
            pageCount: currentPage-1
          }, token);
          if (response.status === 200) {
            setErrorState(false);
            setRecipes(response.data.recipes);
            setNumberOfRecipes(response.data.numberOfRecipes);
          } else if (response.status === 401 || response.status === 403) {
            setAccessToken("")
          } else {
            setErrorState("Error Retrieving Recipes");
            setRecipes([]);
          }
          setIsLoading(false);
          setDisablePagination(false);
        }
        setShouldRefresh(false);
      }
    })();
    return () => {
      isCurrent = false
    }
  }, [shouldRefresh, token, currentPage, setAccessToken]);


  function refreshRecipesAfterDelete() {
    setShouldRefresh(true);
    setIsLoading(true);
  }

  function refreshAndClearError(){
    setShouldRefresh(true);
    setErrorState("");
  }

  async function generateRandomRecipes() {
    setIsLoading(true);
    const response = await getRandomRecipes(token);
    if (response.status === 200 ) {
      setErrorState("");
      setRecipes(response.data);
    } else if (response.status === 401 || response.status === 403) {
      setAccessToken("")
    } else {
      setErrorState("Error Retrieving Recipes");
      setRecipes([]);
      setNumberOfRecipes(1)
    }
    setNumberOfRecipes(1)
    setIsLoading(false);
    setDisablePagination(true);
  }

  async function switchPage(activePage){
    setCurrentPage(activePage);
    setShouldRefresh(true);
  }

  return (
    <Grid padded>
      <Grid.Row columns="equal">
        <Grid.Column>
          <SearchSection
            token={token}
            setAccessToken={setAccessToken}
            setErrorState={setErrorState}
            setRecipes={setRecipes}
            setNumberOfRecipes={setNumberOfRecipes}
            setIsLoading={setIsLoading}
            setDisablePagination={setDisablePagination}
            setShouldRefresh={setShouldRefresh}
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
              loading={isLoading || shouldRefresh}
              basic
              content='Refresh'
              icon='refresh'
              labelPosition='left'
              onClick={() => refreshAndClearError()}
            />
            <Button
              size='small'
              compact
              loading={isLoading || shouldRefresh}
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
          {errorState !== ""  && <h1>{errorState}</h1>
          }
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          {isLoading || shouldRefresh ?
            <Loader active inline='centered' disabled={false} size='huge'>Loading Recipes...</Loader> :
            <Card.Group itemsPerRow={1}>
              <Transition.Group
                duration={1500}
              >
                {recipes.map((r) => (
                  <RecipeCard
                    token={token}
                    setAccessToken={setAccessToken}
                    currentUser={currentUser}
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
          totalPages={Math.ceil(numberOfRecipes/PAGESIZE) || 1} 
          firstItem={null}
          lastItem={null}
          disabled={disablePagination}
          pointing
          secondary
          value={currentPage}
          onPageChange={(e, { activePage })=>switchPage(activePage)}
          style={{marginBottom: '40px'}}
        />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default ViewRecipes;
