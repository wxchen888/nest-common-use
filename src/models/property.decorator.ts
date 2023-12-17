import 'reflect-metadata';

class PDecrator {
  @format('Hello,%s') // 3. 向 greeting 属性添加了一条名为 formatMetadataKey 的元数据，值为 'Hello,%s'
  greeting: string;

  constructor(greeting: string) {
    this.greeting = greeting;
  }

  greet() {
    const formatString = getFormat(this, 'greeting'); // 4. 通过 getFormat 函数获取到了 greeting 属性的格式化字符串
    return formatString.replace('%s', this.greeting);
  }
}

const formatMetadataKey = Symbol('format');
function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString); // 1. greeting 属性添加了一个名为 formatMetadataKey 的元数据
}

// 2. 当 getFormat被调用时，它读取 greeting 属性的元数据。可以获取到之前设置的格式字符串formatMetadataKey
function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

const pd = new PDecrator('World');
console.log(pd.greet()); // Hello,World
