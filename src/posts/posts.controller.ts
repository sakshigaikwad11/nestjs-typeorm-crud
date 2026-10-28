import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  createPost(@Body() dto: CreatePostDto) {
    return this.postsService.createPost(dto);
  }

  @Get()
  getPosts(@Query('title') title?: string) {
    if (title !== undefined) {
      if (!title.trim()) {
        throw new BadRequestException('Title cannot be empty');
      }

      return this.postsService.searchPosts(title.trim());
    }

    return this.postsService.getAllPosts();
  }
}