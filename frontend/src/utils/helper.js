
export function truncateString(str, limit) {
    // Check if the string length is greater than the specified limit
    if (str.length > limit) {
      // Truncate the string and add ellipsis
      return str.substring(0, limit) + '...';
    }
    
    // Return the original string if it's within the limit
    return str;
  }