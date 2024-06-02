/* eslint-disable no-unused-vars */
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

export function groupRoomsByType(data) {
  const grouped = {};

  data.forEach((item) => {
    const roomType = item.room_type_name;
    if (!grouped[roomType]) {
      grouped[roomType] = {
        room_type: roomType,
        children: []
      };
    }
    const { room_type_name, ...rest } = item;
    grouped[roomType].children.push(rest);
  });

  const sortedGroups = Object.values(grouped).sort((a, b) => a.room_type.localeCompare(b.room_type));

  return sortedGroups;
}
