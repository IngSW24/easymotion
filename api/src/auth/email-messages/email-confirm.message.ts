export const generateEmailConfirmMessage = (
  frontendUrl: string,
  token: string,
  userId: string,
  email: string,
) => {
  return `
  <p>Per confermare la tua mail di easymotion, clicca qui</p>
  <a href="${frontendUrl}/confirm-email?token=${token}&userId=${userId}&email=${email}" class="url-button">Conferma la tua mail</a>
  `;
};
