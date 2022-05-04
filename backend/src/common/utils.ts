export function round(num: number, dec: number) {
  if(typeof dec=='undefined' || dec<0) dec = 2;

  let tmp = dec + 1;
  for(var i=1; i<=tmp; i++)
    num = num * 10;

  num = num / 10;
  num = Math.round(num);

  for(var i=1; i<=dec; i++)
    num = num / 10;


  const strNumber = num.toFixed(dec);
  var n = strNumber.search(".");
  strNumber.substr(n+2);
  return Number(strNumber);
}
export const decimales:number = 2;
export function sanitize(object: any): any {
  if (typeof (object) === 'object') {
    if (Array.isArray(object)) {
      object = this.saniArray(object);
    } else {
      object = this.saniObject(object);
    }
  } else {
    console.log('sanitize-No Object', object);
  }
  return object;
}

export function saniArray(array): void {
  for (let index = 0; index < array.length; index++) {
    array[index] = this.sanitize(array[index]);
  }
  return array;
}

export function saniObject(element): any {
  for (const key in element) {
    if (Object.prototype.hasOwnProperty.call(element, key)) {
      if ( typeof(element[key]) === 'object'){
        element[key] = this.sanitize(element[key]);
      } else {
        if (key.substr(0, 1) === '$') {
          element = new element[key];
        }
      }
    } else {
      console.log('saniObject object-NoCall', key, element);
    }
  }
  return element;
}
