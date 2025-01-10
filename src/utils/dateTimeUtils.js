export const formatRawDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatCalendarDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
};

export const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const getDatesInRange = (start, end) => {
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

export const sortActivitiesByTime = (activities) => {
    return [...activities].sort((a, b) => a.time.localeCompare(b.time));
};