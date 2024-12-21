import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/users.entity';
import { ValidRoles } from 'src/auth/interfaces/valid.roles';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: ValidRoles[] = this.reflector.get<ValidRoles[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length == 0) return true;

    const user: User = context.switchToHttp().getRequest().user;

    if (!user) throw new InternalServerErrorException('User not found');

    const isValid = validRoles
      .map((rol) => user.roles.includes(rol))
      .includes(true);

    if (!isValid)
      throw new UnauthorizedException(
        `User ${user.fullName} need to have one of these roles: [${validRoles.join(', ')}]`,
      );

    return isValid;
  }
}
