const generateRandomNumber = (endNum = 20, startNum = 1) => {
  const result = Math.floor(Math.random() * (endNum - startNum + 1)) + startNum;

  return result;
};

export default generateRandomNumber;
