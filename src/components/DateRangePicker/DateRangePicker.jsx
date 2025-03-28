import { useState } from 'react';
import { getDatesInRange } from '../../utils/dateTimeUtils';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DateRangePicker.css';

const DateRangePicker = ({ onDateRangeSelect }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

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
        </div>
    );
};

export default DateRangePicker;