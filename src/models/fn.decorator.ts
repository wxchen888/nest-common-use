class FnGreeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    console.log('greet');
    return 'Hello, ' + this.greeting;
  }
}

function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log(target, propertyKey, descriptor, value);
    // descriptor.enumerable = value;
  };
}

const fg = new FnGreeter('world');
fg.greet();
