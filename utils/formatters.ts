export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  } catch (error) {
    // Fallback for environments without Intl support
    return `$${amount.toFixed(2)}`;
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  try {
    return new Intl.DateFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    // Fallback for environments without Intl support
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }
};

export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentDate = (): string => {
  return formatDateForInput(new Date());
};

export const getFirstDayOfMonth = (): string => {
  const date = new Date();
  date.setDate(1);
  return formatDateForInput(date);
};
