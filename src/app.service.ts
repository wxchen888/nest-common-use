import { Injectable } from '@nestjs/common';

// 具有单一方法的基本服务
@Injectable() // 将类标记为提供者的装饰器
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
