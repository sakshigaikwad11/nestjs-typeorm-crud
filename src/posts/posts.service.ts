import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPost(dto: CreatePostDto): Promise<Post> {
    const user = await this.userRepository.findOneBy({
      id: dto.userId,
    });

    if (!user) {
      throw new NotFoundException(
        `User ${dto.userId} not found`,
      );
    }

    const post = this.postRepository.create({
      title: dto.title,
      content: dto.content,
      user,
    });

    return this.postRepository.save(post);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async searchPosts(title: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('LOWER(post.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      })
      .orderBy('post.id', 'DESC')
      .getMany();
  }
}