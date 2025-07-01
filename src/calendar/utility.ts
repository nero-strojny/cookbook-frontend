
export type DayOfTheWeek = {
  isoString: string // full isostring of date, no locale
  fullDate: string // YYYY-MM-DD, locale date
  day: number // the day value, 1 digit
  month: number // the month value, 2 digits
  weekday: string // the weekday, e.g. sunday
}

export const formatDateToCST = (date: string) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
    timeZone: 'America/Chicago', // CST time zone
  });
  return formatter.format(new Date(date));
};


export const getDaysOfWeek = (currentDate: Date, startOfWeek: number) => {
  const array =  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(startOfWeek + i);
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: 'America/Chicago', // CST time zone
    });
    return {
      isoString: date.toISOString(),
      fullDate: getFullDate(date.toISOString()),
      day: date.getDate(),
      month: date.getMonth() + 1, 
      weekday: formatter.format(date).toLowerCase()
    };
  });
  return array;
}

export const getFirstAndLastDate = (currentDate: Date, startOfWeek: number) => {
  const firstDate = new Date(currentDate.setDate(startOfWeek));
  const lastDate = new Date(currentDate.setDate(startOfWeek + 6));

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: '2-digit', weekday: 'long',
    timeZone: 'America/Chicago', // CST time zone
  });
  return `${formatter.format(new Date(firstDate))} - ${formatter.format(new Date(lastDate))}`;
  
}

export const getShortDayOfWeek = (dateString: string) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'America/Chicago', // CST time zone
  });
  return formatter.format(new Date(dateString));
}

export const getLongDayOfWeek = (fullDate: string, daysOfWeek:{
  isoString: string;
  fullDate: string;
  day: number;
  weekday:string
  month: number;
}[]): string => {
  const dayMatch = daysOfWeek.find(dayObj => dayObj.fullDate === fullDate)
  return dayMatch ? dayMatch.weekday : ''
}

export const getFullDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Chicago',
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(new Date(dateString));

  // Format it to "YYYY-MM-DD"
  const [month, day, year] = formattedDate.split('/');
  return `${year}-${month}-${day}`;
}
