export const formatToINR = (price) => {
  // Format the raw number to look like Indian currency (₹)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // Removes decimals for a cleaner look (e.g., ₹45,500 instead of ₹45,500.00)
  }).format(Number(price));
};