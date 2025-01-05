import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({
    status: 200,
    description: 'Seed data has been successfully executed',
    type: String,
  })
  @ApiResponseProperty()
  @Get()
  seed() {
    return this.seedService.executeSeed();
  }
}
