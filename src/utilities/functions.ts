function calculateGrandTotal(
  totalAmount: number,
  taxPercent: number,
  discount: number = 0,
) {
  const total = Number(totalAmount) || 0;
  const tax = Number(taxPercent) || 0;
  const disc = Number(discount) || 0;

  // apply discount first
  const discountedTotal = total - disc;

  // prevent negative values (important)
  const safeTotal = discountedTotal < 0 ? 0 : discountedTotal;

  const taxAmount = (safeTotal * tax) / 100;
  const grandTotal = safeTotal + taxAmount;

  return grandTotal;
}

export { calculateGrandTotal };
