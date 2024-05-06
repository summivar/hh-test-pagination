import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';
import { UsersQueryDto } from './users.query.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@Query() dto: UsersQueryDto) {
    this.logger.log('Get all users');
    const response = await this.userService.findAll(dto);
    return {
      users: response.users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      totalUsers: response.totalUsers,
    };
  }
}
