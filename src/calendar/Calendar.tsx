import React, { useEffect, useState, useContext } from "react";
import { Card, Grid, Button, Label, Loader, SemanticWIDTHSNUMBER, Divider, Dropdown, Header, Segment, Popup } from "semantic-ui-react";
import { DateTime } from "luxon";
import { Recipe } from "../types/recipe";
import { ServerRequestContext } from "../context/ServerRequestContext";
import { getRandomRecipes, getRecipes, updateCalendar } from "../serviceCalls";
import SimplifiedRecipeCard from "../view/SimplifiedRecipeCard";
import { CalendarObject, calendarToRecipes, populateCalendar } from "../actions/populateCalendar";
import { get, has, indexOf, set } from "lodash";
import { defaultRecipe } from "../reducers/EditRecipeState";

type CalendarProps = {
  width: number
}

const Calendar = ({ width }: CalendarProps) => {

  // start cards on Sunday Date, luxon starts on Mondays, so we
  // have to subtract 1
  let beginningOfWeek: DateTime;
  const today = DateTime.now().weekday;
  beginningOfWeek = today === 7 ? DateTime.now() : DateTime.now().startOf('week').minus({ days: 1 });
  const daysInAWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const defaultRecipeName = "None Selected";

  const { state: serverState, dispatch: serverDispatch } = useContext(ServerRequestContext);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ searchLoading, setSearchLoading ] = useState<boolean>(false);
  const [ currentEditCard, setCurrentEditCard ] = useState<string>("");
  const [ selectionOptions, setSelectionOptions ] = useState<Recipe[]>([]);
  const [ newRecipeName, setNewRecipeName ] = useState<string>("false");
  const [ calendar, setCalendar ] = useState<CalendarObject>({});

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
      if (isCurrent) {
        setIsLoading(true);
        let sundayDate;
        const today = DateTime.now().weekday;
        sundayDate = today === 7 ? DateTime.now() : DateTime.now().startOf('week').minus({ days: 1 });
        console.log(sundayDate);
        const populationResponse = await populateCalendar(sundayDate, serverDispatch, serverState.accessToken);
        setCalendar(populationResponse);
        setIsLoading(false);
      }
    })();
    return () => {
      isCurrent = false;
    }
  }, [serverState.accessToken, serverDispatch]);

  const setRecipeForCalendarDay = async (dayToUpdate: string, recipe?: Recipe) => {
    const tempCalendar = {...calendar};
    set(tempCalendar, dayToUpdate, recipe);
    await updateCalendar(tempCalendar, serverState.accessToken);
    setCalendar(tempCalendar);
  }

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

  const generateRandomRecipe = async(dayToUpdate: string) => {
    setIsLoading(true);
    const response = await getRandomRecipes(serverState.accessToken, 1);
    if (response.status === 200) {
      await setRecipeForCalendarDay(dayToUpdate, response.data[0]);
    } else if (response.status === 401 || response.status === 403) {
      serverDispatch({type: 'LOGOUT_SUCCESS', payload: {}});
    }
    setIsLoading(false);
  }

  const clearRecipe = async (dayToClear: string) => {
    await setRecipeForCalendarDay(dayToClear);
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
    if(response.data.recipes && response.data.recipes.length){
      await setRecipeForCalendarDay(currentEditCard, response.data.recipes[0]);
    }
    setIsLoading(false);

  }

  const createEditCard = () => {
    if(currentEditCard === "") {
      return (
        <Segment style={{border: '1px solid lightgrey', borderRadius: '5px'}} basic>
          <Header as='h3'>No Day Selected</Header>
          <p>Click A Day to Edit its Chosen Recipe</p>
        </Segment>
      );
    }
    const chosenDay = beginningOfWeek.plus({ days: indexOf(daysInAWeek, currentEditCard)});
    let currentDayRecipe = get(calendar, currentEditCard);
    const loadingRecipe = isLoading;
    const showRecipeDetails = has(currentDayRecipe, "recipeName");
    currentDayRecipe = showRecipeDetails ? currentDayRecipe : {...defaultRecipe, recipeName: defaultRecipeName};
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
    const dayCards: JSX.Element[] = [];
    let currentDay = beginningOfWeek;
    daysInAWeek.forEach(day => {
      const recipeOfTheDay = get(calendar, day) as Recipe;
      const loadingRecipe = (isLoading && currentEditCard === day) || !Object.values(calendar).length;
      dayCards.push(
      <Card link key={`recipeCard-${day}`}>
        <Card.Content onClick={()=>setCurrentEditCard(day)}>
          <Card.Header>{currentDay.weekdayLong}</Card.Header>
          <Card.Meta>{currentDay.toLocaleString(DateTime.DATE_FULL)}</Card.Meta>
          <Card.Description>
            {loadingRecipe ?
              <Loader active inline='centered'/> :
              <Label
                as='a'
                basic
                color={has(recipeOfTheDay, "recipeName") ? 'orange' : 'grey'}
                size='large'
              >
                {get(recipeOfTheDay, "recipeName", defaultRecipeName)}
              </Label>
            }
          </Card.Description>
        </Card.Content>
      </Card>);
      currentDay = currentDay.plus({ days: 1 });
    });
    return dayCards;
  }

  return <><Grid padding>
    <Grid.Row style={{margin: '0px 15px'}} columns="equal">
      <Grid.Column>
        <h3>
          {beginningOfWeek.toLocaleString(DateTime.DATE_FULL)}
          {` - `} 
          {beginningOfWeek.plus({ days: 7}).toLocaleString(DateTime.DATE_FULL)}
        </h3>
      </Grid.Column>
      <Grid.Column textAlign='right'>
        <Button
          color='orange'
          onClick={() => serverDispatch({ type: 'ADD_ALL_BASKET', payload: { basketItems: calendarToRecipes(calendar) } })}
        >
          Add All To Basket
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
