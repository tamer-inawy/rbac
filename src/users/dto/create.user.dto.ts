import { Role } from 'src/roles/role.entity';
import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  roles: Role[];
}
