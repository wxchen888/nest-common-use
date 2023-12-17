// ts的装饰器语法
export function ffactory() {
  console.log('ffactiory');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('ffactiory()', target);
  };
}

export function gfactory() {
  console.log('gfactory');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('gfactory()', target);
  };
}

class C {
  @ffactory()
  @gfactory()
  method() {
    console.log('method');
  }
}

const c = new C();
c.method();
