import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Request,
  Response,
  Headers,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as SvgCaptcha from 'svg-captcha';

@Controller({
  path: 'user',
  // version: '1', //进行单个实例所有接口的版本控制 访问时需要在ip后拼接v1
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 获取验证码 */
  @Get('captcha')
  // @Version('1') //进行单个接口的版本控制
  createCaptcha(@Req() req, @Res() res, @Session() session) {
    // @Req是@Request的简写，@Res是@Response的简写
    // 还可以直接用Query装饰器 @Query() query
    const captcha = SvgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#eee',
    });
    session.captcha = captcha.text; //存储验证码并记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  /** 登录 */
  @Post('create')
  createUser(@Body() body, @Session() session) {
    console.log(body, session);
    if (
      (session.captcha as string).toLocaleLowerCase() ===
      body?.code?.toLocaleLowerCase()
    ) {
      // return this.userService.create(body); //正常是要在service做操作，操作数据库并返回响应
      return {
        code: 200,
        message: '成功',
      };
    } else {
      return {
        code: 200,
        message: '失败',
      };
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string, @Headers() headers: any) {
  //   console.log('headers', headers);
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
