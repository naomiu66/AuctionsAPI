import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import 'express-session';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const userId = await this.authService.registerUser(dto);
    req.session.userId = userId;
    return { message: 'Registered and logged in' };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const userId = await this.authService.validateUser(dto);
    req.session.userId = userId;
    return { message: 'Logged in' };
  }

  @Post('logout')
  logout(@Req() req: Request) {
    req.session.destroy((err) => {
      if (err) this.logger.error('Failed to logout', err);
    });
    return { message: 'Logged out' };
  }
}
