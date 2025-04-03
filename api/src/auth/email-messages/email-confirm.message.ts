export const generateEmailConfirmMessage = (
  frontendUrl: string,
  token: string,
  userId: string,
  email: string
) => {
  return `
  <div style="text-align: center;">
  <p>Per confermare la tua mail di EasyMotion, clicca qui</p>
  <a href="${frontendUrl}/confirm-email?token=${token}&userId=${userId}&email=${email}" class="url-button">Conferma la tua mail</a>
  </div>
  `;
};

export const generatePasswordResetMessage = (
  frontendUrl: string,
  token: string,
  userId: string
) => {
  return `
  <div style="text-align: center;">
  <p>Per modificare la tua password di EasyMotion, clicca qui</p>
  <a href="${frontendUrl}/password-restore?token=${token}&userId=${userId}" class="url-button">Modifica password</a>
  </div>
  `;
};
