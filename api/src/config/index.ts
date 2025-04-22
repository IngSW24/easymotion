import dbConfig from "./db.config";
import frontendConfig from "./frontend.config";
import jwtConfig from "./jwt.config";
import smtpConfig from "./smtp.config";
import s3Config from "./s3.config";

export * from "./db.config";
export * from "./jwt.config";
export * from "./smtp.config";
export * from "./s3.config";

export default [dbConfig, jwtConfig, smtpConfig, frontendConfig, s3Config];
