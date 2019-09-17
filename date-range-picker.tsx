import { addDays, differenceInDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Calendar, DateObject, LocaleConfig, PeriodMarking } from "react-native-calendars";

// LocaleConfig.locales.no = {
//   monthNames: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
//   monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
//   dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
//   dayNamesShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]
// };
// LocaleConfig.defaultLocale = "no";

type IDateRange = {
  from: Date;
  to: Date;
};

type IDateRangePicker = {
  width: number | string;
  minDate: Date;
  maxDate: Date;
  onFullRangeSelected: (range: IDateRange) => void;
  onFromOnlySelected?: (from: Date) => void;
  initialRange?: IDateRange;
  firstDay?: number; // 0 is Sunday, 1 is Monday...
  color?: string;
  textColor?: string;
};

const DateRangePicker: React.FC<IDateRangePicker> = props => {
  const [fromDate, setFromDate] = useState(props.initialRange ? props.initialRange.from : props.minDate);
  const [toDate, setToDate] = useState(props.initialRange ? props.initialRange.to : props.minDate);
  const [selectedDates, setSelectedDates] = useState<{ [date: string]: PeriodMarking }>({});

  const dateColor = props.color || "#f9be00";
  const dateTextColor = props.textColor || "#032a3b";
  const dateFormat = "yyyy-MM-dd";

  useEffect(() => {
    setupRange();
  }, [fromDate, toDate]);

  const setupRange = () => {
    const numberOfDays = differenceInDays(toDate, fromDate);
    const dates: { [date: string]: PeriodMarking } = {};
    if (numberOfDays < 1) {
      setSelectedDates({
        [format(fromDate, dateFormat)]: {
          startingDay: true,
          color: dateColor,
          textColor: dateTextColor
        }
      });
      return;
    }
    for (let i = 0; i <= numberOfDays; i++)
      dates[format(addDays(fromDate, i), dateFormat)] = {
        startingDay: i === 0,
        endingDay: i === numberOfDays,
        color: dateColor,
        textColor: dateTextColor
      };
    setSelectedDates(dates);
  };

  const onDayPress = (day: DateObject) => {
    const date = new Date(new Date(day.dateString).setHours(12, 0, 0, 0));
    const numberOfDays = differenceInDays(date, fromDate);
    if (numberOfDays < 1 || fromDate < toDate) {
      setFromDate(date);
      setToDate(date);
      if (props.onFromOnlySelected) props.onFromOnlySelected(date);
    } else {
      setToDate(date);
      props.onFullRangeSelected({ from: fromDate, to: date });
    }
  };

  return (
    <Calendar
      style={{ width: props.width }}
      minDate={props.minDate}
      maxDate={props.maxDate}
      firstDay={props.firstDay || 0}
      onDayPress={onDayPress}
      markingType={"period"}
      markedDates={selectedDates}
    />
  );
};

export default DateRangePicker;
