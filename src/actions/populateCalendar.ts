import { get, set } from "lodash";
import { DateTime } from "luxon";
import React from "react";
import { ServerAction } from "../reducers/ServerAction";
import { createCalendar, getCalendar, getRecipe } from "../serviceCalls";
import { Recipe } from "../types/recipe";

export type CalendarRequest = {
  monday: string,
  tuesday: string,
  wednesday: string,
  thursday: string,
  friday: string,
  saturday: string,
  sunday: string
}

export type CalendarObject = {
  _id?: string;
  startDate?: string;
  monday?: Recipe,
  tuesday?: Recipe,
  wednesday?: Recipe,
  thursday?: Recipe,
  friday?: Recipe,
  saturday?: Recipe,
  sunday?: Recipe
  householdID?: string;
}

const getRecipes = async (calendarRequest: CalendarObject, token: string): Promise<CalendarObject> => {
  const currentCalendar = {...calendarRequest};
  delete currentCalendar._id;
  delete currentCalendar.startDate;
  delete currentCalendar.householdID;
  // short cut for iterating through all the days, we just have to delete the other keys on the calendar ^
  const recipesData = await Promise.all(Object.keys(currentCalendar).map(request => getIndividualRecipe(request, get(calendarRequest,request), token)));
  const calendar = {};
  recipesData.forEach(recipeData => set(calendar, recipeData.day, recipeData.recipe));
  return calendar as CalendarObject;
}

const getIndividualRecipe = async(day: string, recipe: Recipe, token: string): Promise<{day: string, recipe: Recipe | undefined}> => {
  // the id becomes blank from the calendar, don't retrieve them if so
  if (recipe._id === "000000000000000000000000" || recipe._id === undefined) { return { day, recipe: undefined } }
  const response = await getRecipe(recipe._id, token);
  return { day, recipe: response.data };
}

export const recipesToCalendar = (calendar: CalendarObject): CalendarObject => {
  return {
    monday: calendar.monday,
    tuesday: calendar.tuesday,
    wednesday:calendar.wednesday,
    thursday: calendar.thursday,
    friday: calendar.friday,
    saturday: calendar.saturday,
    sunday: calendar.sunday
  }
}

export const calendarToRecipes = (calendar: CalendarObject): Recipe[] => {
  const recipes: Recipe[] = []
  Object.values(calendar).forEach(field => {
    if(typeof field === 'object') {
      recipes.push(field);
    }
  });
  return recipes;
}

export const populateCalendar = async (
  beginningOfWeek: DateTime,
  serverDispatch: React.Dispatch<ServerAction>,
  token: string):
  Promise<CalendarObject> => {
  const startDate = beginningOfWeek.toISODate();
  // First, see if we already have a calendar for the current sunday date and the household
  const getCalendarResponse = await getCalendar(startDate, token)
  if(getCalendarResponse.status=== 200) {
    // If we have a calendar, retrieve the recipes by their id
    const calendar = await getRecipes(getCalendarResponse.data, token);
    return {...calendar, _id: getCalendarResponse.data._id, startDate: getCalendarResponse.data.startDate};
  } else if (getCalendarResponse.status === 404) {
    // If we do not have a calendar, create one
    const createCalendarRes = await createCalendar(startDate, token);
    if (createCalendarRes.status !== 201) {
      serverDispatch({ type: 'SHOW_MESSAGE',
        payload: { messageContent: `There was an error populating the calendar`, success: false }
      });
      return {};
    }
    return {_id: createCalendarRes.data._id,
      ...recipesToCalendar(createCalendarRes.data),
      startDate: createCalendarRes.data.startDate
    };
  } else if (getCalendarResponse.status === 401 || getCalendarResponse.status === 403) {
    serverDispatch({ type: 'LOGOUT_SUCCESS', payload: {} });
  }
  serverDispatch({ type: 'SHOW_MESSAGE',
    payload: { messageContent: `There was an error populating the calendar`, success: false }
  });
  return {};
}