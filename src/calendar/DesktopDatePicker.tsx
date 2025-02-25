import { ReactNode } from 'react';
import { DayOfTheWeek, getLongDayOfWeek, getShortDayOfWeek } from './utility';
import { Recipe } from '../types/Recipe';

type DesktopDatePickerProps = {
  daysOfWeek: DayOfTheWeek[]
  selectedDate: string
  handleSetSelectedDate:(fullDate:string)=>void
  recipeMap: {[key:string]: Recipe}
  children: ReactNode
}

export const DesktopDatePicker = (props: DesktopDatePickerProps) => {
  const {daysOfWeek, selectedDate, handleSetSelectedDate, children, recipeMap} = props
  return (
    <div className="w-1/2 space-y-1">
      {daysOfWeek.map((day) => (
        <div
          key={day.fullDate}
          onClick={() => handleSetSelectedDate(day.fullDate)}
          className={`p-3 rounded-lg cursor-pointer
                      ${selectedDate === day.fullDate ? 'bg-rust border border-rust text-white' : 'border border-sandy hover:bg-sandy hover:text-white'}`}
        >
          <div className="text-sm">
            {`${getShortDayOfWeek(day.isoString)} ${day.month}/${day.day}: ${recipeMap[getLongDayOfWeek(day.fullDate, daysOfWeek)]?.recipeName || 'No Recipe'}` }
          </div>
        </div>
      ))}
      {children}
    </div>
  )
}
