import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRole } from './users/schema/user.schema';
import { UsersService } from './users/users.service';
import { CreateAdminDto } from './users/dto/create.admin.dto.';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  const email = 'danylolabai@gmail.com';
  const existing = await userService.findByEmail(email);

  if (existing) {
    console.log('admin alreade exist');
    await app.close();
    return;
  }

  const createAdminDto: CreateAdminDto = {
    email,
    username: 'AdminMan',
    password: 'admin2003',
    role: UserRole.ADMIN,
  };

  const admin = await userService.createUser(createAdminDto);
  console.log(' Admin user created:', admin.email, 'password: admin2003');

  await app.close();
}

void bootstrap();
