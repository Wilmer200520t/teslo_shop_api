import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: (ConfigService: ConfigService) => ({
        secret:
          process.env.JWT_TESLO_SECRET || ConfigService.get('JWT_TESLO_SECRET'),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
    }),

    //NO Async
    //JwtModule.register({
    //  secret: process.env.JWT_TESLO_SECRET,
    //  signOptions: { expiresIn: '1d' },
    //}),
  ],
  exports: [JwtModule, PassportModule, JwtStrategy, TypeOrmModule],
})
export class AuthModule {}
