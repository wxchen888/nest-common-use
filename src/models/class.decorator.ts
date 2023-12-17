@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

// 冰冻函数
function sealed(target: new (message: string) => Greeter) {
  console.log('sealed target', target);
  Object.seal(target);
  Object.seal(target.prototype);
}

// 重载
function classDecorator<
  T extends { new (...args: any[]): Record<string, any> },
>(constructor: T) {
  return class extends constructor {
    newProperty = 'new property';
    greeting = 'override';
  };
}

const greeter = new Greeter('world');
