import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UsersQueryDto } from './users.query.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(dto: UsersQueryDto): Promise<{
    users: UsersEntity[];
    totalUsers: number;
  }> {
    const skip = (dto.pageNumber - 1) * dto.pageSize;
    const [users, totalUsers] = await this.usersRepo.findAndCount({ skip, take: dto.pageSize });
    return { users, totalUsers };
  }
}
