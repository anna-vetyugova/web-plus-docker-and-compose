import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PickType } from '@nestjs/mapped-types';

export class SinginUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
] as const) {}
