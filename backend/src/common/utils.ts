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
  strNumber.substring(n+2);
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
        if (key.substring(0, 1) === '$') {
          element = new element[key];
        }
      }
    } else {
      console.log('saniObject object-NoCall', key, element);
    }
  }
  return element;
}

export function makeFilter(fldsString:any=[],params:any){
  const filter = {};
  const keys = [];
  for (let i = 0; i < fldsString.length; i++) {
    const key = fldsString[i];
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if(params[key] !== 'undefined'){
        
        //filter[key] = new RegExp(params[key],'i');
        filter[key] = { '$regex': `${params[key]}`, '$options': 'i' };
        const idx = fldsString.indexOf(key);
        if( idx !== -1){
          keys.push(keys)
          //fldsString.splice ( idx, 1);
        }
      }
    }
  }
  
  if(params.searchItem.length){
    const or = [];
    console.log(params.searchItem);
    //params.searchItem = params.searchItem === 'undefined' ? '' : params.searchItem;
    let searchItem = params.searchItem ? params.searchItem.replace(/  /g, ' ') : '';
    const searcharray: any[] = searchItem.trim().split(' ');
  
    if (searcharray.length > 0){
      filter['$and'] = [];
      for (let i = 0; i < searcharray.length; i++) {
        const or = []
        const str = searcharray[i];
        const v = [];
        for (let n = 0; n < fldsString.length; n++) {
          const fld = fldsString[n];
          const idx = keys.indexOf(fld);
          if( idx === -1){
            const o = {};
            o[fld] = { '$regex': `${str}`, '$options': 'i' };
            console.log(o);
            v.push( o );
            or.push(o)
          }
        }
        const m = {'$or': or}
        filter['$and'].push(m);
      }
    }
  }
  return filter;
}

export function makeAggregate (fldsString:any,params:any) {
  const aggregate = [];
  for (let i = 0; i < fldsString.length; i++) {
    const key = fldsString[i];
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const fld = {};
      fld[fldsString[i]] = { '$regex': `${params[key]}`, '$options': 'i' };
      const m = {
        '$match': fld
      };
      aggregate.push( m );
      const idx = fldsString.indexOf(key);
      if( idx !== -1){
        fldsString.splice ( idx, 1);
      }
    }
  }
  if(params.searchItem.length){
    const or = [];
    let searchItem = params.searchItem ? params.searchItem.replace(/  /g, ' ') : '';
    const searcharray: any[] = searchItem.trim().split(' ');
    if (searcharray.length > 0){
      const o = {};
      for (let n = 0; n < fldsString.length; n++) {
        const fld = fldsString[n];
        const v = [];
        for (let i = 0; i < searcharray.length; i++) {
          const str = searcharray[i];
          v.push(new RegExp( str, 'i' ));
          //v.push({ '$regex': `${str}`, '$options': 'i' })
        }
        o[fld] = {'$in': v};
      }
      const m = {
        '$match': o
      };
      aggregate.push( m );
      console.log(o);
      //for (let i = 0; i < searcharray.length; i++) {
      //  const str = searcharray[i];
      //  const v = [];
      //  for (let n = 0; n < fldsString.length; n++) {
      //    const fld = fldsString[n];
      //    o[fld] = { '$regex': `${str}`, '$options': 'i' }
      //  }
      //  console.log(o)
      //  const m = {
      //    '$match': o
      //  };
      //  aggregate.push( m );
      //}
    }
  }
  return aggregate;
}