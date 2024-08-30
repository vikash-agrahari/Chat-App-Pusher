import { Injectable, Inject } from '@nestjs/common';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreateOnboardingDto } from 'src/modules/on-boarding/dto/on-boarding.dto';
import { Dao } from 'src/providers/database/dao.provider';
import { IUser } from 'src/schema/user.schema';

@Injectable()
export class UserEntity extends Dao {
  constructor(@Inject('USER_MODEL') private userModel: Model<IUser>) {
    super(userModel);
  }

  async create(createUserDto: CreateOnboardingDto) {
    const user = await this.saveData(createUserDto);
    return user;
  }

  async getUserById(userId: string) {
    return await this.findOne({ _id: userId });
  }

  async getUserByEmail(email: string) {
    const data = await this.findOne({ email: email });
    return data;
  }

  async getAllUsers(search: string, userId: string) {
    
    const matchConditions: Record<string, any> = {
      _id: { $ne: new Types.ObjectId(userId) },
    };
  
  
    if (search) {
      matchConditions.username = { $regex: search, $options: "i" }; // Case-insensitive search
    }
  
    const pipeline = [
      { $match: matchConditions }, 
      { $sort: { username: 1 } },  // Sort alphabetically by username
      { $project: { password: 0, createdAt: 0, updatedAt: 0 } }, 
    ];
  
    return await this.aggregateData(pipeline, { allowDiskUse: true });
  }
  
}
