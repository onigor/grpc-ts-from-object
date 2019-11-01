export interface InterfaceT<T> {
  new(): T;
}

export interface Config {
  [key: string]: InterfaceT<any>;
}

const setName = (key: string, isList?: boolean): string => {
  if (!key) {
    return key;
  }
  return `set${key.slice(0, 1).toUpperCase()}${key.slice(1)}${isList ? 'List' : ''}`;
}

const isList = (obj: any): boolean => {
  return typeof obj === 'object' && obj instanceof Array;
}


const fromObject = <T, K extends { [key: string]: any }>(GenericClass: InterfaceT<T>, config: Config, data: K): T => {
  const result: T = new GenericClass();
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const list = isList(data[key]);
      if (typeof data[key] === 'object' && !list) {
        if (typeof config[key] === 'undefined') {
          continue;
        }
        ((result as any)[setName(key, list)] as Function)(fromObject(config[key] as InterfaceT<any>, config, data[key]));
      } else {
        if (list && typeof data[key][0] === 'object' && config[key]) {
          const arr = [];
          for (let i in data[key]) {
            arr.push(fromObject(config[key], config, data[key][i]));
          }
          ((result as any)[setName(key, list)] as Function)(arr);
        }
        ((result as any)[setName(key, list)] as Function)(data[key]);
      }
    }
  }
  return result;
};

export default fromObject;
