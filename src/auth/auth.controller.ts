import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/index';
import { JwtInterfaceDto } from './interfaces/jwt.interface.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/users.entity';
import { RawHeaders } from './decorators/get-rawHeaders.decorator';
import { IncomingHttpHeaders } from 'http';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<JwtInterfaceDto> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<JwtInterfaceDto> {
    return await this.authService.login(loginUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  async profile(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: IncomingHttpHeaders[],
  ): Promise<any> {
    return { email, user, rawHeaders };
  }

  @Get('server_info')
  //@UseGuards(AuthGuard(), UserRoleGuard)
  //@SetMetadata('roles', ['admin', 'super-admin'])
  //@RoleProtected(ValidRoles.admin, ValidRoles.superAdmin)
  @Auth(ValidRoles.admin, ValidRoles.superAdmin)
  async server_info(): Promise<any> {
    return {
      server: 'teslo-shop',
      version: '1.0.0',
      status: 'running',
    };
  }
}
