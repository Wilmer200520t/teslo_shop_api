import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtInterfaceDto } from './interfaces/jwt.interface.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<JwtInterfaceDto> {
    try {
      const user = this.userRepository.create(createUserDto);
      user.password = bcrypt.hashSync(user.password, 10);
      const newUser = await this.userRepository.save(user);

      return {
        token: this.getJwtToken({ id: newUser.id }),
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<JwtInterfaceDto> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      select: { password: true, id: true },
      where: { email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid password');
    }

    delete user.password;

    return {
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(jwtPayload: JwtPayload) {
    const payload = {
      id: jwtPayload.id,
      app: 'teslo-shop',
      creator: 'wilmer200520t',
    };
    return this.jwtService.sign(payload);
  }

  private handleDBError(error: any) {
    this.logger.error(error);

    let errorMessage = error.message || error.detail || error;
    errorMessage = errorMessage.replaceAll(/"/g, '');

    throw new BadRequestException(errorMessage);
  }

  async checkAuthStatus(idUser: string): Promise<any> {
    if (!idUser) throw new UnauthorizedException('User not found in request');

    const userDB = await this.userRepository.findOneBy({ id: idUser });

    if (!userDB) throw new UnauthorizedException('User not found in database');

    return {
      ...userDB,
      token: this.getJwtToken({ id: userDB.id }),
    };
  }
}
