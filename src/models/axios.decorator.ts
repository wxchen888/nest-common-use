import axios from 'axios';

// 高阶函数
const Get = (url: string) => {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    console.log(target, key, descriptor);
    const originMethod = descriptor.value;
    axios
      .get(url)
      .then((res) => {
        originMethod(res, {
          status: 200,
          success: true,
          code: 0,
        });
      })
      .catch((error) => {
        originMethod(error, {
          status: 400,
          success: false,
          code: 0,
        });
      });
  };
};

class Controller {
  constructor() {}
  @Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
  getData(res: any, message: any) {
    console.log(res.data.result.list, message);
    return Promise.resolve({
      res,
      message,
    });
  }
}
