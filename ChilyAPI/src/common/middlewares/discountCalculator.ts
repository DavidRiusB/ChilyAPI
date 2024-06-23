export const discountCalculator = (
  discount: number,
  totalPrice: number
): number => {
  const discountFactor = 1 - discount / 100;
  const discountedTotal = totalPrice * discountFactor;
  return discountedTotal;
};
