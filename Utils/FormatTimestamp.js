// THIS HAS TWO DIFFERENT EXPORTS INDEPENDENT OF EACH OTHER
// USE CAREFULLY

// 1. Calculating time for news cards
export function formatTimestamp(timestamp) {
  const { seconds } = timestamp;
  const newsDate = new Date(seconds * 1000); // Convert Firestore timestamp to JavaScript Date
  const now = new Date();
  const differenceInSeconds = (now - newsDate) / 1000;
  const differenceInMinutes = differenceInSeconds / 60;
  const differenceInHours = differenceInMinutes / 60;
  const differenceInDays = differenceInHours / 24;

  if (differenceInSeconds < 60) {
    return 'Just now';
  } else if (differenceInMinutes < 60) {
    return `${Math.floor(differenceInMinutes)} minute${Math.floor(differenceInMinutes) === 1 ? '' : 's'} ago`;
  } else if (differenceInHours < 2) {
    return `1 hour ago`;
  } else if (differenceInHours < 24) {
    return `${Math.floor(differenceInHours)} hour${Math.floor(differenceInHours) === 1 ? '' : 's'} ago`;
  } else if (differenceInDays < 2) {
    return `1 day ago`;
  } else {
    return `${Math.floor(differenceInDays)} day${Math.floor(differenceInDays) === 1 ? '' : 's'} ago`;
  }
}


// 2. Another export - USED SEPERATELY (used for getting full date) 

// Indian timestamp with Date
export function indianTimestamp(timestamp) {
  const { seconds } = timestamp;
  const date = new Date(seconds * 1000); // Convert Firestore timestamp to JavaScript Date

  
  let istOffset = 0;
  // Uncomment following line to Convert UTC time to IST
  // istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTimestamp = new Date(date.getTime() + istOffset);

  
  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get individual components of the date
  const day = istTimestamp.getDate();
  const month = months[istTimestamp.getMonth()];
  const year = istTimestamp.getFullYear();
  const hours = istTimestamp.getHours();
  const minutes = String(istTimestamp.getMinutes()).padStart(2, '0');
  const secondsStr = String(istTimestamp.getSeconds()).padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  // Format the date and time string
  const formattedDate = `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;

  return formattedDate;
}

// // Example usage with a mock Firestore timestamp
// const mockTimestamp = { seconds: 1716299556 }; // Represents '20 May 2024, 17:12:36 UTC'
// console.log(formatTimestamp(mockTimestamp)); // Output: '20 May 2024, 10:42 pm (IST)'



// export No : 3
// 3. INDIAN DATE- TIME WHEN INPUT IS IN MILLI-SECONDS

export function indianTimestampFromMilliSeconds(timestamp) {
  // Convert milliseconds timestamp directly to JavaScript Date
  const date = new Date(timestamp);

  // IST Offset (5 hours 30 minutes)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTimestamp = new Date(date.getTime() + istOffset);

  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get individual components of the date
  const day = istTimestamp.getDate();
  const month = months[istTimestamp.getMonth()];
  const year = istTimestamp.getFullYear();
  const hours = istTimestamp.getHours();
  const minutes = String(istTimestamp.getMinutes()).padStart(2, '0');
  const secondsStr = String(istTimestamp.getSeconds()).padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  // Format the date and time string
  const formattedDate = `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;

  return formattedDate;
}


// 4. FORMAT TIMESTAMP WHEN INPUT IS IN MILLISECONDS
// fourth export from this document

export function formatTimestampFromMilliSeconds(timestamp) {
  // Create a Date object from the milliseconds timestamp
  const newsDate = new Date(timestamp);
  const now = new Date();
  
  // Calculate the difference in various units
  const differenceInSeconds = (now - newsDate) / 1000;
  const differenceInMinutes = differenceInSeconds / 60;
  const differenceInHours = differenceInMinutes / 60;
  const differenceInDays = differenceInHours / 24;

  // Format the time difference into a human-readable format
  if (differenceInSeconds < 60) {
    return 'Just now';
  } else if (differenceInMinutes < 60) {
    return `${Math.floor(differenceInMinutes)} minute${Math.floor(differenceInMinutes) === 1 ? '' : 's'} ago`;
  } else if (differenceInHours < 2) {
    return `1 hour ago`;
  } else if (differenceInHours < 24) {
    return `${Math.floor(differenceInHours)} hour${Math.floor(differenceInHours) === 1 ? '' : 's'} ago`;
  } else if (differenceInDays < 2) {
    return `1 day ago`;
  } else {
    return `${Math.floor(differenceInDays)} day${Math.floor(differenceInDays) === 1 ? '' : 's'} ago`;
  }
}

// export No : 5
// 5.  DATE- TIME WHEN INPUT IS IN MILLI-SECONDS

export function dateTimeFromMilliSeconds(timestamp) {
  // Convert milliseconds timestamp directly to JavaScript Date
  const date = new Date(timestamp);

  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get individual components of the date
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const secondsStr = String(date.getSeconds()).padStart(2, '0');

  // Determine AM/PM
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  // Format the date and time string
  const formattedDate = `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;

  return formattedDate;
}
