import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
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
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        this.logger.error('Failed to logout', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.clearCookie('sessionId');
      return res.json({ message: 'Logged out' });
    });
  }
}
