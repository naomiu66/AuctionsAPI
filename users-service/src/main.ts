import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { RedisService } from './redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);
  const redisService = app.get(RedisService);
  const redisClient = redisService.getClient();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const redisStore: session.Store = new RedisStore({
    client: redisClient,
    prefix: 'session:',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.use(
    session({
      store: redisStore,
      secret: configService.get<string>('SESSION_SECRET') ?? '',
      resave: false,
      saveUninitialized: false,
      name: 'sessionId',
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60,
      },
    }),
  );

  await app.listen(configService.get<string>('PORT') ?? 3000, () => {
    Logger.log(
      `Listening on port: ${configService.get<string>('PORT') ?? 3000}`,
    );
  });
}
bootstrap().catch((err) => {
  Logger.error('Error during bootstrap', err);
  process.exit(1);
});
