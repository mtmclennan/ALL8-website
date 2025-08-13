export const emailValidate = (value: string) => {
  const emailFormat = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  return emailFormat.test(value);
};

export const stringValidate = (value: string) => value.trim() !== '';
