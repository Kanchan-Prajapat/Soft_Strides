export const getEstimatedDeliveryDate = (days = 5) => {
  const date = new Date();

  let addedDays = 0;

  while (addedDays < days) {
    date.setDate(date.getDate() + 1);

    // Skip Sunday
    if (date.getDay() !== 0) {
      addedDays++;
    }
  }

  return date;
};