export const readParent = function (prodList: any[], id: string, descr?: string): string {
  if (descr == undefined) descr = '';
  const item = findProduct(prodList, id);
  if (item._id) {
    if (item.contiene)
      descr += (item.unidad ? ` ${item.name} ${item.contiene} ${item.unidad}` : ` ${item.name} ${item.contiene}`)
    else if (item.unidad) descr += ` ${item.name} ${item.unidad}`
    else descr += ` ${item.name}`
    if (item.parent && item.parent != null && item.pesable != true) {
      descr = readParent(prodList, item.parent, descr);
    }
  }
  return descr.trim();
}
export const findProduct = function (prodList: any[], id: string) {

  for (let index = 0; index < prodList.length; index++) {
    const e = prodList[index];
    if (`${e._id}` == `${id}`) return e;
  }
  return {};
}

export const qryProductosProcess = function (qry: any) {
//  console.log(qry)
  if (qry.Articulo) {
    for (const key in qry.Articulo) {
      if (Object.prototype.hasOwnProperty.call(qry.Articulo, key)) {
        const array: any[] = qry.Articulo[key];
        if (key == '$and' || key == '$or') {
          for (let i = 0; i < array.length; i++) {
            for (const id in array[i]) {
              const element: any = array[i][id];
              if (element['$regex']) {
                qry.Articulo[key][i][id] = { $regex: new RegExp(element['$regex'], element['mod']) }
              }
            }
          }
        } else {
          const element = qry.Articulo[key];
          if (element['$regex']) {
            qry.Articulo[key]['$regex'] = new RegExp(qry.Articulo[key]['$regex'], 'i')
          }
          if (element['$in']) {
            if (element['$in']['$regExp']) {
              let array = element['$in']['$regExp']
              for (let index = 0; index < array.length; index++) {
                array[index] = new RegExp(`^${array[index]}`, 'i');
              }
              qry.Articulo[key]['$in'] = array
            }
          }
        }
      }
    }
  } else qry.Articulo = {}
  if (qry.Producto) {
    for (const key in qry.Producto) {
      if (Object.prototype.hasOwnProperty.call(qry.Producto, key)) {
        const element = qry.Producto[key];
        if (element['$regex']) {
          qry.Producto[key]['$regex'] = new RegExp(qry.Producto[key]['$regex'], 'i')
        }
      }
    }
  } else qry.Producto = {}
  if (!qry.Extra) qry.Extra = {};
  return qry;
}