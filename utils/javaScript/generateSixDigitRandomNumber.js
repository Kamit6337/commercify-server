function generateSixDigitRandomNumber() {
  // Generate a random decimal between 0 and 1
  const randomDecimal = Math.random();

  // Scale the random decimal to the range [100000, 999999]
  const randomNumber = Math.floor(randomDecimal * 900000) + 100000;

  return randomNumber;
}

export default generateSixDigitRandomNumber;
