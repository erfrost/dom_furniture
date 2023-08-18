export const numberInputValidate = (number) => {
  const regex = /^\d+$/;

  return regex.test(number);
};
