import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dto/blog.dto';
import { Blog } from './schemas/blog.schema';

@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBlog(@Body() dto: BlogDto, @Request() req: any): Promise<Blog> {
    return this.blogService.createBlog(dto, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateBlog(@Body() dto: BlogDto, @Param('id') id: string): Promise<Blog> {
    return this.blogService.updateBlog(dto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  removeBlog(@Body() dto: BlogDto, @Param('id') id: string): Promise<Blog> {
    return this.blogService.removeBlog(dto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-blogs')
  getCurrentUsersBlogs(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<Blog[]> {
    return this.blogService.getCurrentUsersBlogs(req, id);
  }

  @Get()
  getAllBlogs(): Promise<Blog[]> {
    return this.blogService.getAllBlogs();
  }

  @Get(':id')
  getOneBlog(@Param('id') id: string): Promise<Blog> {
    return this.blogService.getOneBlog(id);
  }
}
