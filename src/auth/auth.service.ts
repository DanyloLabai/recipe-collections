import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schema/user.schema';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }

  async registerUser(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;

    const existingEmail = await this.userService.findByEmail(email);
    if (existingEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingUsername = await this.userService.findByUsername(username);
    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  login(user: UserDocument) {
    try {
      const payload = {
        sub: user.id as string,
        email: user.email,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('An unexpected error occurred');
    }
  }
}
