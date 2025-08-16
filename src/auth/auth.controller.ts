import {
  Controller,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UserDocument } from 'src/users/schema/user.schema';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.registerUser(createUserDto);
      const token = this.authService.login(user);

      return {
        message: 'User created successfully',
        access_token: token.access_token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return { statusCode: 400, message: error.message };
      }
      return { statusCode: 500, message: 'Unexpected error' };
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: ExpressRequest & { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest & { user: UserDocument }) {
    return req.user;
  }
}
