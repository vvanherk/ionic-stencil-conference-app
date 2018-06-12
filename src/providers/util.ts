export function bindActions<T>(cmp: any, methods: T) {
  return Object.keys(methods).reduce((preValue, methodName) => {
    preValue[methodName] = methods[methodName].bind(cmp);
    return preValue;
  }, <T>{});
}

export function createActionDefaults<T>(methods: T) {
  return Object.keys(methods).reduce((preValue, methodName) => {
    // tslint:disable-next-line:no-empty
    preValue[methodName] = () => {};
    return preValue;
  }, <T>{});
}
