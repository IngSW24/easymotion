import dbConfig from "./db.config";
import frontendConfig from "./frontend.config";
import jwtConfig from "./jwt.config";
import smtpConfig from "./smtp.config";

export * from "./db.config";
export * from "./jwt.config";
export * from "./smtp.config";

export default [dbConfig, jwtConfig, smtpConfig, frontendConfig];
