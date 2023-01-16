type Property = { type: string, value: string };

type Product = {
  id: string;
  properties: Property[];
};

export const createPropertyMap = <T extends Product>(products: T[]) => {
  const map: {[key in string]: string} = {};
  const hash = (properties: T['properties']) => properties.slice().sort((a, b) => a.type > b.type ? -1 : 1).map(({ value }) => value).join('-');

  for (let product of products) {
    const key = hash(product.properties);
    map[key] = product.id;
  }

  const getProduct = (properties: {[key in string]: string}) => {
    const selectionHash = hash(transform(properties));
    return map[selectionHash];
  }
  
  return [getProduct, map] as const;
}

export const getPropertyList = <T extends Product>(products: T[]) => {
  const propertySet = new Set<string>();
  
  for (let product of products) {
    for (let property of product.properties) {
      propertySet.add(`${property.type},${property.value}`);    
    }
  }

  const propertyList: {[key in string]: string[]} = {};
    
  for (let entry of propertySet) {
    const [type, value] = entry.split(',');
    propertyList[type] = [...(propertyList[type] ?? []), value];
  }

  return propertyList;
};

export const transform = (properties: {[key in string]: string}) => {
  const keys = Object.keys(properties);
  return keys.map(key => ({ type: key, value: properties[key]}));
}