import { UserRole } from '../schema/user.schema';
import { CreateUserDto } from './createUser.dto';

export class CreateAdminDto extends CreateUserDto {
  readonly role: UserRole = UserRole.ADMIN;
}
