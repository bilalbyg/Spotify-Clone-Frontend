function secondsToTime(seconds) {
  const date = new Date(null);
  date.setSeconds(seconds); // specify value for SECONDS here
  const result = date.toISOString().slice(11, 19);
  return result;
}

export { secondsToTime };
