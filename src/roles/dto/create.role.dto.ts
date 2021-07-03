import { Role } from 'src/auth/role.enum';
import { Group } from 'src/groups/group.entity';
import { User } from 'src/users/user.entity';

export class CreateRoleDto {
  role: Role;
  group: Group;
  user: User;
}
