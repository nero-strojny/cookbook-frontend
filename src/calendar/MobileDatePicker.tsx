import { DayOfTheWeek, getShortDayOfWeek } from "./utility";

type MobileDatePickerProps = {
  daysOfWeek: DayOfTheWeek[]
  selectedDate: string
  handleSetSelectedDate:(fullDate:string)=>void
}

export const MobileDatePicker = (props: MobileDatePickerProps) => {
  const {daysOfWeek, selectedDate, handleSetSelectedDate} = props
  return (
  <div className="flex flex-wrap justify-center gap-3 mb-4">
    {daysOfWeek.map((day) => (
      <button
        role="button"
        key={day.fullDate}
        onClick={() => handleSetSelectedDate(day.fullDate)}
        className={`w-18 h-18 rounded-full flex items-center justify-center cursor-pointer border-2
                    ${selectedDate === day.fullDate ? 'bg-rust text-white border-rust' : 'bg-seasalt text-black border-sandy'}`}
      >
      <div className={`flex flex-col items-center text-md`}>
        <span>{getShortDayOfWeek(day.isoString)}</span>
        <span>{day.month}-{day.day}</span>
      </div>
      </button>
    ))}
</div>)
}
