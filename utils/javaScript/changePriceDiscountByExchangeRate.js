const changePriceDiscountByExchangeRate = (
  price,
  discountPercentage,
  exchangeRate
) => {
  const exchangeRatePrice = Math.round(price * exchangeRate);

  const roundDiscountPercent = Math.round(discountPercentage);
  const discountedPrice = Math.round(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  return { exchangeRatePrice, roundDiscountPercent, discountedPrice };
};

export default changePriceDiscountByExchangeRate;
