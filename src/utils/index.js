// Initialize the result array
export const arraySplicer = (array, splicer) => {
  const subarraySizes = Array.from({
    length: Math.ceil(array.length / splicer)
  });

  return subarraySizes.reduce((acc) => {
    const subarray = array.splice(0, splicer);
    acc.push(subarray);
    return acc;
  }, []);
};

export function formatCurrencyUZS(amount) {
  const formatter = new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return formatter.format(amount);
}
