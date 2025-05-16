## EasyMotion API

## Environment variables

### CORS

- `FRONTEND_URL`: The url of the frontend application (if multiple use comma separated URLs)

### Database

- `DATABASE_URL`: The url for the database connection

### Email

- `SMTP_HOST`: The SMTP host for email communications
- `SMTP_PORT`: The SMTP port for email communications
- `SMTP_SECURE`: Use TLS over SMTP

### JWT

- `JWT_SECRET`: Secret JWT signing key key
- `JWT_AUDIENCE`: Audience for JWTs
- `JWT_ISSUER`: Issuer of JWTs
- `JWT_EXPIRES_IN`: Expiration of access tokens
- `JWT_REFRESH_EXPIRES_IN`: Expiration of refresh tokens

### Initial User (when initializing with empty user table)

- `INITIAL_USER_ID`: Id of the initial user
- `INITIAL_USER_EMAIL`: Email of the initial user
- `INITIAL_USER_PASSWORD`: Password of the initial user

### S3 (when using S3 for assets)

- `AWS_ACCESS_KEY_ID`: Access key ID for the provided IAM Role
- `AWS_SECRET_ACCESS_KEY`: Secret key for the provided IAM Role
- `AWS_REGION`: The region of the bucket
- `AWS_S3_BUCKET`: The name of the bucket to be used

### Assets (settings for assets management)

- `USE_S3`: if set to 'true' uses the S3 client, otherwise uses a mockup
- `MAX_IMAGE_SIZE`: maximum size in bytes for images before compressing them. Defaults to 500000 if not set

### Ollama (for small AI tasks)

- `OLLAMA_BASE_URL`: the base url where the model is currently being hosted
- `OLLAMA_API_KEY`: the api key to access the model endpoint
- `OLLAMA_MODEL`: type of model to use
