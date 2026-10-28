import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create(dto);

    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.getUserById(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOneBy({
        email: dto.email,
      });

      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, dto);

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.getUserById(id);

    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }

  async searchUsers(name: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      })
      .getMany();
  }
}