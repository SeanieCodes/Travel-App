import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DateRangePicker.css';

const DateRangePicker = ({ onDateRangeSelect }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const getDatesInRange = (start, end) => {
        const dates = [];
        let currentDate = new Date(Date.UTC(
            start.getFullYear(),
            start.getMonth(),
            start.getDate()
        ));
        const lastDate = new Date(Date.UTC(
            end.getFullYear(),
            end.getMonth(),
            end.getDate()
        ));

        while (currentDate <= lastDate) {
            dates.push(new Date(currentDate));
            currentDate = new Date(Date.UTC(
                currentDate.getUTCFullYear(),
                currentDate.getUTCMonth(),
                currentDate.getUTCDate() + 1
            ));
        }
        return dates;
    };

    const handleDateChange = (update) => {
        setDateRange(update);

        if (update[0] && update[1]) {
            const allDates = getDatesInRange(update[0], update[1]);
            onDateRangeSelect(allDates);
        }
    };

    return (
        <div className="date-range-selector">
            <h3>Select Your Travel Dates</h3>
            
            <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                inline
                minDate={new Date()}
                monthsShown={2}
                className="custom-datepicker"
            />
            
            {startDate && endDate && (
                <div className="date-summary">
                    Selected: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;