import { Module } from '@nestjs/common';
import { AppController } from './app.controller'; //类似vue的路由
import { AppService } from './app.service'; //封装网络请求 和数据库交互等
import { UserModule } from './user/user.module';

// 应用的根模块
@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
