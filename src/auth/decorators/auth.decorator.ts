import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  META_ROLES,
  RoleProtected,
} from './role-protected/role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces';

export function Auth(...args: ValidRoles[]) {
  return applyDecorators(
    SetMetadata(META_ROLES, args),
    UseGuards(AuthGuard(), UserRoleGuard),
    RoleProtected(...args),
  );
}
