const dateInMilli = (day) => {
  const now = Date.now();
  const calculateMilli = day * 24 * 60 * 60 * 1000;
  return now + calculateMilli;
};

export default dateInMilli;
