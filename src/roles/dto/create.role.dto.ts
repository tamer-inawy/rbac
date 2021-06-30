import { Role } from 'src/auth/role.enum';
import { User } from 'src/users/user.entity';

export class CreateRoleDto {
  role: Role;
  groupid: number | null;
  user: User;
}
