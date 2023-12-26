

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
      //timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', theOptions);
};

export function formatTimeDifferencePast(timestamp) {
  const currentTime = new Date();
  const pastTime = new Date(timestamp);

  const timeDifferenceInMilliseconds = currentTime - pastTime;
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

  return formatTimeDifference(timeDifferenceInMinutes);
};

export function formatTimeDifferenceFuture(timestamp) {
  const currentTime = new Date();
  const futureTime = new Date(timestamp);

  const timeDifferenceInMilliseconds = futureTime - currentTime;
  const timeDifferenceInMinutes = Math.abs(Math.floor(timeDifferenceInMilliseconds / (1000 * 60)));
  // It is possbile that currentTime reaches or exceeds futureTime, so handling that
  const timeExceeded = timeDifferenceInMilliseconds < 0 ? true : false;

  return {
    difference: formatTimeDifference(timeDifferenceInMinutes),
    timeExceeded: timeExceeded
  };
};

export function formatTimeDifferenceBetweenTwoTimes(timestamp1, timestamp2) {
  const timeDifferenceInMilliseconds = Math.abs(new Date(timestamp1) - new Date(timestamp2));
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

  return formatTimeDifference(timeDifferenceInMinutes);
};

export function addHoursToTimestamp(timestamp, hoursToAdd) {
  let date = new Date(timestamp);
  date.setHours(date.getHours() + hoursToAdd);

  // Format the date to match the input timestamp format
  const year = date.getUTCFullYear();
  const month = `0${date.getUTCMonth() + 1}`.slice(-2);
  const day = `0${date.getUTCDate()}`.slice(-2);
  const hours = `0${date.getUTCHours()}`.slice(-2);
  const minutes = `0${date.getUTCMinutes()}`.slice(-2);
  const seconds = `0${date.getUTCSeconds()}`.slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}

function formatTimeDifference(timeDifferenceInMinutes) {
  if (timeDifferenceInMinutes < 60) {
    return `${timeDifferenceInMinutes} minutes`;
  } else if (timeDifferenceInMinutes < 24 * 60) {
    const hours = Math.floor(timeDifferenceInMinutes / 60);
    const remainingMinutes = timeDifferenceInMinutes % 60;
    return `${hours} hours ${remainingMinutes} minutes`;
  } else {
    const days = Math.floor(timeDifferenceInMinutes / (24 * 60));
    const remainingHours = Math.floor((timeDifferenceInMinutes % (24 * 60)) / 60);
    return `${days} days ${remainingHours} hours`;
  }
}
