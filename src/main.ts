import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as sessions from 'express-session';

async function bootstrap() {
  // 使用核心函数NestFactory 创建Nest应用实例的应用入口文件
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  // 开启版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    sessions({
      secret: 'wangxiaochen', //生成服务端session签名 也就是加盐
      rolling: true, //每次请求时 强行设置cookie重置cookie过期时间
      name: 'wangxiaochen.sid',
      cookie: {
        maxAge: 999999,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
