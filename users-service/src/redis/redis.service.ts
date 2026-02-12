import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from '@redis/client';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: RedisClientType;

  constructor(private configService: ConfigService) {
    this.client = createClient({
      url: configService.get<string>('REDIS_URL'),
    });

    this.client
      .connect()
      .then(() => {
        this.logger.log('Redis client connected');
      })
      .catch((err) => {
        this.logger.error('Failed to connect redis client', err);
        throw err;
      });
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      this.logger.log('Redis disconnected');
    } catch (err) {
      this.logger.error('Failed to disconnect redis client', err);
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
