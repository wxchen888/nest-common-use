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
