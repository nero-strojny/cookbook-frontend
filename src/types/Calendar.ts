import { Recipe } from "./Recipe";

export interface Calendar {
  _id: string;
  householdID: string;
  startDate: string;
  monday: Recipe;
  tuesday: Recipe;
  wednesday: Recipe;
  thursday: Recipe;
  friday: Recipe;
  saturday: Recipe;
  sunday: Recipe;
}

export const calendarToRecipeMap = (calendar?:Calendar): {[key:string]: Recipe} => {
  return !!calendar ? {
    sunday: calendar.sunday,
    monday: calendar.monday,
    tuesday: calendar.tuesday,
    wednesday: calendar.wednesday,
    thursday: calendar.thursday,
    friday: calendar.friday,
    saturday: calendar.saturday
  } : {}
}