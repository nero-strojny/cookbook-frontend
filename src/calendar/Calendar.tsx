import React, {useContext, useEffect, useState} from "react";
import {
  Button,
  Card,
  Divider,
  Dropdown,
  Grid,
  Header,
  Label,
  Loader,
  Popup,
  Segment,
  SemanticWIDTHSNUMBER
} from "semantic-ui-react";
import {DateTime} from "luxon";
import {Recipe} from "../types/recipe";
import {ServerRequestContext} from "../context/ServerRequestContext";
import {getRandomRecipes, getRecipes} from "../serviceCalls";
import SimplifiedRecipeCard from "../view/SimplifiedRecipeCard";

type CalendarProps = {
  width: number
}

const Calendar = ({width}: CalendarProps) => {
  const DAYS_IN_A_WEEK = 7;
  const defaultRecipeName = "None Selected";
  // start cards on Sunday Date, luxon starts on Mondays, so we
  // have to subtract 1
  const beginningOfWeek = DateTime.now().startOf('week').minus({days: 1});

  const {state: serverState, dispatch: serverDispatch} = useContext(ServerRequestContext);
  const [recipes, setRecipes] = useState<Recipe[]>(serverState.calendarRecipes || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [currentEditCard, setCurrentEditCard] = useState<number>(-1);
  const [selectionOptions, setSelectionOptions] = useState<Recipe[]>([]);
  const [newRecipeName, setNewRecipeName] = useState<string>("false");

  let cardsPerRow: SemanticWIDTHSNUMBER = 1;
  let segmentWidth: string = '98%';
  if (width > 1050) {
    cardsPerRow = 7;
    segmentWidth = '70%';
  } else if (width > 600) {
    cardsPerRow = 4;
    segmentWidth = '80%';
  } else if (width > 200) {
    cardsPerRow = 2;
  }

  useEffect(() => {
    let isCurrent = true;
    (async () => {
      if (isCurrent && !recipes.length) {
        setIsLoading(true);
        const response = await getRandomRecipes(serverState.accessToken, DAYS_IN_A_WEEK);
        if (response.status === 200) {
          setRecipes(response.data);
        } else if (response.status === 401 || response.status === 403) {
          serverDispatch({type: 'LOGOUT_SUCCESS', payload: {}});
        }
        setIsLoading(false);
      }
    })();
    return () => {
      isCurrent = false;
    }
  });

  const submitSearch = async (prefix: string) => {
    if (prefix !== "") {
      setSearchLoading(true);
      const response = await getRecipes({
        pageSize: 5,
        pageCount: 0,
        queryRecipe: {recipeName: prefix}
      }, serverState.accessToken);
      if (response.status === 401 || response.status === 403) {
        serverDispatch({type: 'LOGOUT_SUCCESS', payload: {}});
      }
      setSelectionOptions(response.data.recipes);
      setSearchLoading(false);
    }
  }

  const generateRandomRecipe = async (index: number) => {
    setIsLoading(true);
    const response = await getRandomRecipes(serverState.accessToken, 1);
    if (response.status === 200) {
      const tempRecipes = [...recipes];
      tempRecipes[index] = response.data[0];
      setRecipes(tempRecipes);
    } else if (response.status === 401 || response.status === 403) {
      serverDispatch({type: 'LOGOUT_SUCCESS', payload: {}});
    }
    setIsLoading(false);
  }

  const clearRecipe = (index: number) => {
    const tempRecipes = [...recipes];
    tempRecipes[index] = {
      ...tempRecipes[index],
      recipeName: defaultRecipeName
    };
    setRecipes(tempRecipes);
  }

  const searchAndSetRecipe = async () => {
    setIsLoading(true);
    const response = await getRecipes({
      pageSize: 1,
      pageCount: 0,
      queryRecipe: {recipeName: newRecipeName}
    }, serverState.accessToken);
    if (response.status === 401 || response.status === 403) {
      serverDispatch({type: 'LOGOUT_SUCCESS', payload: {}});
    }
    if (response.data.recipes && response.data.recipes.length) {
      const tempRecipes = [...recipes];
      tempRecipes[currentEditCard] = response.data.recipes[0];
      setRecipes(tempRecipes);
    }
    setIsLoading(false);

  }

  const createEditCard = () => {
    if (currentEditCard === -1) {
      return (
        <Segment style={{border: '1px solid lightgrey', borderRadius: '5px'}} basic>
          <Header as='h3'>No Day Selected</Header>
          <p>Click A Day to Edit its Chosen Recipe</p>
        </Segment>
      );
    }
    const chosenDay = beginningOfWeek.plus({days: currentEditCard});
    const currentDayRecipe = recipes[currentEditCard];
    const loadingRecipe = isLoading || !recipes.length;
    const showRecipeDetails = currentDayRecipe.recipeName !== defaultRecipeName;
    return (
      <Segment style={{
        border: '1px solid lightgrey',
        borderRadius: '5px',
        width: segmentWidth,
        textAlign: 'left'
      }} basic>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={4}>
              <Header as='h3'>{chosenDay.weekdayLong}</Header>
              <p>{chosenDay.toLocaleString(DateTime.DATE_FULL)}</p>
            </Grid.Column>
            <Grid.Column width={12} textAlign="right" floated="right">
              <Dropdown
                search
                selection
                loading={searchLoading}
                onChange={(_event, {value}) => setNewRecipeName(String(value))}
                placeholder="Enter Specific Recipe Here"
                options={selectionOptions.map(opt => ({
                  text: opt.recipeName,
                  value: opt.recipeName,
                  key: opt.recipeName
                }))}
                onSearchChange={(event) => {
                  const element = event.target as HTMLInputElement
                  submitSearch(element.value);
                }}
              />
              <Popup content='Set Specific Recipe' trigger={<Button
                style={{marginLeft: '3px'}}
                icon='check'
                color='orange'
                loading={isLoading}
                onClick={() => searchAndSetRecipe()}
              />}/>
              <Popup content='Random Recipe' trigger={<Button
                icon='random'
                color='orange'
                loading={isLoading}
                onClick={() => generateRandomRecipe(currentEditCard)}
              />}/>
              <Popup content='Clear Recipe' trigger={<Button
                icon='ban'
                color='orange'
                inverted
                loading={isLoading}
                onClick={() => clearRecipe(currentEditCard)}
              />}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <SimplifiedRecipeCard recipe={currentDayRecipe} showRecipeDetails={showRecipeDetails}
                                    loading={loadingRecipe}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }


  const createDayCards = () => {
    const dayCards = [];
    let currentDay = beginningOfWeek;
    for (let i = 0; i < DAYS_IN_A_WEEK; i++) {
      const loadingRecipe = (isLoading && currentEditCard === i) || !recipes.length;
      dayCards.push(
        <Card link key={`recipeCard-${currentDay.weekdayLong}`}>
          <Card.Content onClick={() => setCurrentEditCard(i)}>
            <Card.Header>{currentDay.weekdayLong}</Card.Header>
            <Card.Meta>{currentDay.toLocaleString(DateTime.DATE_FULL)}</Card.Meta>
            <Card.Description>
              {loadingRecipe ?
                <Loader active inline='centered'/> :
                <Label
                  as='a'
                  basic
                  color={recipes[i].recipeName === defaultRecipeName ? 'grey' : 'orange'}
                  size='large'
                >
                  {recipes[i].recipeName}
                </Label>
              }
            </Card.Description>
          </Card.Content>
        </Card>);
      currentDay = currentDay.plus({days: 1});
    }
    return dayCards;
  }

  return <><Grid padding>
    <Grid.Row style={{textAlign: 'right', marginRight: '15px'}}>
      <Grid.Column>
        <Button
          color='orange'
          onClick={() => serverDispatch({
            type: 'ADD_ALL_BASKET',
            payload: {basketItems: recipes.filter(recipe => recipe.recipeName !== defaultRecipeName)}
          })}
        >
          Add All To Basket
        </Button>
        <Button
          color='orange'
          onClick={() => serverDispatch({type: 'ADD_ALL_CALENDAR', payload: {calendarRecipes: recipes}})}
        >
          Save Calendar
        </Button>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row style={{margin: '0px 2em'}}>
      <Grid.Column>
        <Card.Group itemsPerRow={cardsPerRow}>
          {createDayCards()}
        </Card.Group>
      </Grid.Column>
    </Grid.Row>
    <Divider/>
  </Grid>
    <Grid centered>
      <Grid.Row>
        {createEditCard()}
      </Grid.Row>
    </Grid>
  </>
}

export default Calendar;
