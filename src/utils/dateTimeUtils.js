// Format a raw date string for display in the UI
export const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    // Format as Month Day, Year (e.g., January 1, 2025)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Format a Date object to a consistent string format for database storage
  export const formatCalendarDate = (date) => {
    if (!date) return '';
    
    // Format as YYYY-MM-DD
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // Normalize date string to ensure consistent format
  export const formatRawDateString = (dateString) => {
    if (!dateString) return '';
    
    // Handle Date objects
    if (dateString instanceof Date) {
      return formatCalendarDate(dateString);
    }
    
    // Already formatted string
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    // Convert other string formats to consistent format
    return formatCalendarDate(new Date(dateString));
  };
  
  // Sort activities by time
  export const sortActivitiesByTime = (activities) => {
    if (!activities || !Array.isArray(activities)) return [];
    
    return [...activities].sort((a, b) => {
      // If time is not provided, put it at the end
      if (!a.time) return 1;
      if (!b.time) return -1;
      
      // Compare times
      return a.time.localeCompare(b.time);
    });
  };
  
  // Get all dates in a range (inclusive)
  export const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    // Set time to beginning of day to avoid issues with time changes
    currentDate.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    // Loop through each day and add it to the array
    while (currentDate <= lastDate) {
      dates.push(formatCalendarDate(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };