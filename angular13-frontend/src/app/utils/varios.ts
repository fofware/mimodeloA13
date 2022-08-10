export function simpleSort( data:any[], fieldName:string){
  return data.sort((a, b) => {
    let fa = a[fieldName].toLowerCase(),
        fb = b[fieldName].toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
  });
}
