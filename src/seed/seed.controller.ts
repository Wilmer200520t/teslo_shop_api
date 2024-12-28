import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Seed data has been successfully executed',
    type: String,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, only super admin can seed data',
    type: String,
  })
  @ApiResponseProperty()
  @Get()
  @Auth(ValidRoles.superAdmin)
  seed() {
    return this.seedService.executeSeed();
  }
}
