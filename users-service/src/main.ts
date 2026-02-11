import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import passport from 'passport';
// import { RedisStore } from 'connect-redis';
// import * as connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  });
  await redisClient.connect();
  // const RedisStore = new connectRedis.RedisStore(session);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SECRET_SESSION ?? 'my-session-secret',
      resave: false,
      saveUninitialized: false,
      name: 'sid',
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Listening on port: ${process.env.PORT ?? 3000}`);
  });
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
