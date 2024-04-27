const changePriceDiscountByExchangeRate = (
  price,
  discountPercentage,
  exchangeRate
) => {
  const exchangeRatePrice = price * exchangeRate;
  const roundDiscountPercent = Math.trunc(discountPercentage);
  const discountedPrice = Math.trunc(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  return { exchangeRatePrice, roundDiscountPercent, discountedPrice };
};

export default changePriceDiscountByExchangeRate;
