import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schemas';
import { BlogDto } from './dto/blog.dto';
import { Blog, BlogDocument } from './schemas/blog.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createBlog(dto: BlogDto, req: any): Promise<Blog> {
    const currentUser = await this.userModel.findById(req.user.id);
    const newBlog = new this.blogModel({
      title: dto.title,
      content: dto.content,
      sharedBy: currentUser.email,
      userId: currentUser._id,
    });
    return await newBlog.save();
  }

  async updateBlog(dto: BlogDto, id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId) {
      throw new UnauthorizedException('You can update only your blogs!');
    }
    return await this.blogModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async removeBlog(dto: BlogDto, id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    if (dto.userId !== blog.userId) {
      throw new UnauthorizedException('You can remove only your blogs!');
    }
    return await this.blogModel.findByIdAndRemove(id);
  }

  async getCurrentUsersBlogs(req: any, id: string): Promise<Blog[]> {
    return await this.blogModel.find({ userId: req.user.id });
  }

  async getAllBlogs(): Promise<Blog[]> {
    return await this.blogModel.find();
  }

  async getOneBlog(id: string): Promise<Blog> {
    return await this.blogModel.findById(id);
  }
}
