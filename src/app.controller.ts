import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// 单一的控制路由
@Controller('get')
export class AppController {
  // appService依赖注入 不需要实例化就能使用类里面的方法，因为已经通过控制反转在外部容器进行实例化了
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
