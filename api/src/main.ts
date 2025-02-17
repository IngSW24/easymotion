import { bootstrap, setupSwagger } from "./bootstrap";

async function start() {
  const app = await bootstrap();
  if (process.env.NODE_ENV !== "production") {
    setupSwagger(app);
  }
  await app.listen(3000, "0.0.0.0");
}

start();
