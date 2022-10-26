import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extraDataFilter'
})
export class ExtraDataFilterPipe implements PipeTransform {

  transform(list: any[], query: string): any[] {
      //let searchItem = query ? query.replace(/  /g, ' ') : '';
  //
      //const searcharray: any[] = searchItem.trim().split(' ');
  //
      //for (let i = 0; i < searcharray.length; i++) {
      //  const text = searcharray[i];
      //  list = list ? list.filter(item => item.fullname.search(new RegExp(text, 'i')) > -1) : [];
      //}
      //console
      //return list;
    list = list ? list.filter(item => item.tipo === query) : [];
    console
    return list;
  }
}
