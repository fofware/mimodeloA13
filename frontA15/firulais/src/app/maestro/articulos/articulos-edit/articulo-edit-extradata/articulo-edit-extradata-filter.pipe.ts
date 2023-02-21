import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'articuloEditExtradataFilter',
  standalone: true,
})
export class ArticuloEditExtradataFilterPipe implements PipeTransform {

  transform(values: any[], args: string): any[] {
    let result:any[] = []
    /*
    for (let i = 0; i < values.length; i++) {
      const reg = values[i];
      if(reg.tipo === args ) result.push(reg);

    }
    */

    for (const reg of values) {
      if(reg.tipo===args) result = [...result,reg];
    }
    return result;
  }

}
