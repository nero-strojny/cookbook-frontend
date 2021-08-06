import React, { useEffect, useState } from "react";
import { Input, Grid, Button, Icon, Card, Transition, Loader, Pagination } from "semantic-ui-react";
import RecipeCard from "./RecipeCard";
import { getRecipes, searchRecipe, getRandomRecipes } from "../serviceCalls";

function ViewRecipes({ 
  token, 
  currentUser, 
  onCreateRecipe,
  onEditRecipe,
}) {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchField, setSearchField] = useState("");
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
          if (response.status !== 200) {
            setErrorState("Error Retrieving Recipes");
            setRecipes([]);
          } else {
            setErrorState(false);
            setRecipes(response.data.recipes);
            setNumberOfRecipes(response.data.numberOfRecipes);
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
  }, [shouldRefresh, token, currentPage]);


  function refreshRecipesAfterDelete() {
    setShouldRefresh(true);
    setIsLoading(true);
  }

  function refreshAndClearError(){
    setShouldRefresh(true);
    setErrorState("");
  }

  async function submitSearch() {
    setIsLoading(true);
    if (searchField !== ""){
      const response = await searchRecipe(searchField, token);
      if (response.status !== 200) {
        setErrorState("Error Retrieving Recipes");
        setRecipes([]);
        setNumberOfRecipes(1);
      } else if (!response.data.length) {
        setErrorState("No Matching Recipes Found");
        setNumberOfRecipes(1);
        setRecipes(response.data);
      } else {
        setErrorState("");
        setRecipes(response.data);
      }
      setNumberOfRecipes(1)
      setIsLoading(false);
      setDisablePagination(true);
    } else {
      setShouldRefresh(true);
    }
  }

  async function generateRandomRecipes() {
    setIsLoading(true);
    const response = await getRandomRecipes(token);
    if (response.status !== 200) {
      setErrorState("Error Retrieving Recipes");
      setRecipes([]);
      setNumberOfRecipes(1)
    } else {
      setErrorState("");
      setRecipes(response.data);
    }
    setNumberOfRecipes(1)
    setIsLoading(false);
    setDisablePagination(true);
  }

  async function onInputChange(event) {
    if (event.key === 'Enter') {
      submitSearch();
    }
  }

  async function switchPage(activePage){
    setCurrentPage(activePage);
    setShouldRefresh(true);
  }

  return (
    <Grid padded>
      <Grid.Row columns="equal">
        <Grid.Column>
          <Input
            fluid
            placeholder="Search Recipe"
            icon={<Icon name="search" color='orange' inverted circular link onClick={() => submitSearch()} />}
            onChange={(event) => setSearchField(event.target.value)}
            onKeyPress={async (event) => await onInputChange(event)} />
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
