export default function calculatePercentages(
  budget: number,
  amountSaved: number,
  amountSpent: number
) {
  if (budget === 0) {
    return { savedPercentage: 0, spentPercentage: 0 };
  }
  const savedPercentage = (amountSaved / budget) * 100;
  const spentPercentage = (amountSpent / budget) * 100;
  return { savedPercentage, spentPercentage };
}
