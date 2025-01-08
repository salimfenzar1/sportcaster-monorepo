import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environment } from '@libs/shared/util-env/src'; 
import { UsersModule } from '@libs/backend/user/src/lib/users.module';
import { AuthModule } from '@libs/backend/auth/src/lib/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        load: [() => environment],
        isGlobal: true, 
      }),
      AuthModule,
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('MONGO_DB_CONNECTION_STRING'),
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              Logger.verbose(
                `Mongoose db connected to ${configService.get<string>('MONGO_DB_CONNECTION_STRING')}`
              );
            });
            connection._events.connected();
            return connection;
          },
        }),
        inject: [ConfigService],
      }),
      UsersModule,
     
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
