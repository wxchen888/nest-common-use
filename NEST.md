# Nestjs学习

## 元编程

编程语言提供的用于在编译或运行时操作程序本身的语法和特性。
包括：
1、反射reflection：通过反射可以动态获取类的属性、方法、构造方法、继承关系、注释等。
2、宏macros：宏是一种将源代码转换为其他源代码的编译器技术，比如vue3的defineProps、defineEmits、defineExpose。
3、模板元编程：通过模板引擎将数据填充到模板中，比如vue2的v-for、v-if、v-on等。
4、注解annotations：通过注解为类、方法、参数、变量等添加一些额外信息，比如java中的@RequestMapping。

### 装饰器

ts默认就支持装饰器，js也马上通过装饰器支持提案。
书写方式可以在一行`@f @g x`, 也可以多行, 类似于复合函数f(g(x))，调用方法类似于洋葱圈模型，从最外层开始，依次调用每个装饰器，最后执行被装饰的方法。
各种装饰器的执行顺序依次为：
1、参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
2、参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
3、参数装饰器应用到构造函数。
4、类装饰器应用到类。

#### 类装饰器

类装饰器在类声明之前被声明。类装饰器应用于类构造函数，可以用来监视、修改或者替换类定义。
注意不能用在.d.ts文件或declare的类上。

```ts
@sealed
@classDecorator
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
function sealed(constructor: new (message: string) => Greeter) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
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
console.log(greeter.greet());
```

#### 方法装饰器

方法装饰器声明在一个方法的声明之前（紧靠着方法声明）。 它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。 方法装饰器不能用在声明文件( .d.ts)，重载或者任何外部上下文（比如declare的类）中。

方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象 target。
2、成员的名字 propertyKey。
3、成员的属性描述符 descriptor。

```ts
class FnGreeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  //
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
    // descriptor.enumerable = value; // 此处如果代码输出目标版本小于ES5，属性描述符将会是undefined
  };
}

const fg = new FnGreeter('world');
fg.greet();
```

#### 访问器装饰器

访问器装饰器声明在一个访问器的声明之前（紧靠着访问器声明）。 访问器装饰器应用于访问器的 属性描述符并且可以用来监视，修改或替换一个访问器的定义。 访问器装饰器不能用在声明文件中（.d.ts），或者任何外部上下文（比如 declare的类）里。

TypeScript不允许同时装饰一个成员的get和set访问器。取而代之的是，一个成员的所有装饰的必须应用在文档顺序的第一个访问器上。这是因为，在装饰器应用于一个属性描述符时，它联合了get和set访问器，而不是分开声明的。

同样的，如果代码输出目标版本低于ES5，PropertyDescriptor将会是undefined。

方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象 target。
2、成员的名字 propertyKey。
3、成员的属性描述符 descriptor。

```ts
class Point {
  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}

function configurable(value: boolean) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}

const p = new Point(1, 2);

p.x = 3; //无法为“x”赋值，因为它是只读属性。
```

#### 属性装饰器

方法装饰器声明在一个方法的声明之前（紧靠着方法声明）。 它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。 方法装饰器不能用在声明文件( .d.ts)，重载或者任何外部上下文（比如declare的类）中。

方法装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象 target。
2、成员的名字 propertyKey。
**注意：属性描述符不会做为参数传入属性装饰器，这与TypeScript是如何初始化属性装饰器的有关。 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。返回值也会被忽略。因此，属性描述符只能用来监视类中是否声明了某个名字的属性。**

```ts
import 'reflect-metadata';

class PDecrator {
  @format('Hello,%s') // 3. 向 greeting 属性添加了一条名为 formatMetadataKey 的元数据，值为 'Hello,%s'
  greeting: string;

  constructor(greeting: string) {
    this.greeting = greeting;
  }

  greet() {
    const formatString = getFormat(this, 'greeting'); // 4. 通过 getFormat 函数获取到了 greeting 属性的格式化字符串
    return formatString.replace('%s', this.greeting); // 5. replace(str, replaceValue) 将str替换为replaceValue
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
```

#### 参数装饰器

参数装饰器应用于构造函数参数、方法参数。
参数装饰器的返回值会被忽略。

```ts
class ParamClass {
  greeting: string;

  constructor(msg: string) {
    this.greeting = msg;
  }

  @validate
  greet(@required name: string) {
    return `Hello ${name} ${this.greeting}!`;
  }
}

const requiredMetadataKey = Symbol('required');

function required(
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) {
  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey,
  );
}

function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(name: string) => string>,
) {
  const method = descriptor.value as (name: string) => string;
  descriptor.value = function (...args) {
    const requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName,
    );
    if (requiredParameters) {
      for (const parameterIndex of requiredParameters) {
        if (
          parameterIndex >= args.length ||
          args[parameterIndex] === undefined
        ) {
          throw new Error('Missing required argument.');
        }
      }
    }

    return method.apply(this, args);
  };
}
```

#### 对象属性描述符

Object.defineProperty(obj,key,descriptor)
descriptor：
1、configurable：表示能否通过 delete 删除属性从而重新定义属性，或者能否修改属性的特性（数据属性和访问器属性的切换），包括属性是否可写（但writable为true时还是可以改value的，writable也可以被改为false），默认为false不可重新定义属性、不可修改属性的特性。
2、enumerable：表示能否通过 for-in 循环返回属性，默认为false，不能被枚举。
3、value：包含这个属性的数据值，默认为 undefined。
4、writable：表示这个属性是否可写，如果为 false，则 value 只读，默认为 false。
5、get：一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。
6、set：一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。

**注意：这里说的默认为false是指通过Object.defineProperty去创建对象属性时，如果未指定，则默认为false。如果是通过字面量类型创建的对象，则默认为true。**
