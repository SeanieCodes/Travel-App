export const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  export const formatCalendarDate = (date) => {
    if (!date) return '';
    
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  export const formatRawDateString = (dateString) => {
    if (!dateString) return '';
    
    if (dateString instanceof Date) {
      return formatCalendarDate(dateString);
    }
    
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    return formatCalendarDate(new Date(dateString));
  };
  
  export const sortActivitiesByTime = (activities) => {
    if (!activities || !Array.isArray(activities)) return [];
    
    return [...activities].sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      
      return a.time.localeCompare(b.time);
    });
  };
  
  export const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    currentDate.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    while (currentDate <= lastDate) {
      dates.push(formatCalendarDate(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };