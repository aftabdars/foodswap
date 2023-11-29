

export function formatDateTimeString(inputDateTime, options) {
    const date = new Date(inputDateTime);
    const theOptions = options? options : 
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', theOptions);
};