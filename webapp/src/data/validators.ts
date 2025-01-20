export const ensurePasswordConstraints = (password: string) => {
  const regex = /^(?=.*[0-9]).{6,}$/;
  return regex.test(password);
};

export const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
