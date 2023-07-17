import { Request, Response, NextFunction } from "express";

const data = [
{ fch: '29/07/2021',	cmp:'Factura C	0002-00000118', doc: 'Doc. (otro)		   ', cae:'71301270329033', value: 560},		
{ fch: '26/07/2021',	cmp:'Factura C	0002-00000117', doc: 'Doc. (otro)		   ', cae:'71301051449356', value: 514},		
{ fch: '16/07/2021',	cmp:'Factura C	0002-00000116', doc: 'Doc. (otro)		   ', cae:'71291494719894', value: 1450.72},				
{ fch: '16/07/2021',	cmp:'Factura C	0002-00000115', doc: 'Doc. (otro)		   ', cae:'71291494394471', value: 5492},			
{ fch: '12/07/2021',	cmp:'Factura C	0002-00000114', doc: 'Doc. (otro)		   ', cae:'71281269772881', value: 3190},			
{ fch: '29/06/2021',	cmp:'Factura C	0002-00000113', doc: 'Doc. (otro)		   ', cae:'71261496465355', value: 3670},			
{ fch: '25/06/2021',	cmp:'Factura C	0002-00000112', doc: 'CUIT	33710076699', cae:'71261292891157', value: 1520},			
{ fch: '15/06/2021',	cmp:'Factura C	0002-00000111', doc: 'CUIT	33710076699', cae:'71241802154047', value: 60000},				
{ fch: '19/03/2021',	cmp:'Factura C	0002-00000110', doc: 'Doc. (otro)		   ', cae:'71121431589926', value: 200},		
{ fch: '17/03/2021',	cmp:'Factura C	0002-00000109', doc: 'CUIT	27123435309', cae:'71111345695851', value: 12000},				
{ fch: '17/03/2021',	cmp:'Factura C	0002-00000108', doc: 'CUIT	33710076699', cae:'71111345550488', value: 80000},				
{ fch: '27/01/2021',	cmp:'Factura C	0002-00000107', doc: 'CUIT	33710076699', cae:'71041888995137', value: 40000},				
{ fch: '27/01/2021',	cmp:'Factura C	0002-00000106', doc: 'CUIT	27123435309', cae:'71041888249852', value: 6000},			
{ fch: '29/12/2020',	cmp:'Factura C	0002-00000105', doc: 'CUIT	33710076699', cae:'70521592291618', value: 40000},				
{ fch: '29/12/2020',	cmp:'Factura C	0002-00000104', doc: 'CUIT	27123435309', cae:'70521591721797', value: 6000},			
{ fch: '30/11/2020',	cmp:'Factura C	0002-00000103', doc: 'CUIT	33710076699', cae:'70481319505776', value: 40000},				
{ fch: '30/11/2020',	cmp:'Factura C	0002-00000102', doc: 'CUIT	27123435309', cae:'70481316917454', value: 6000},			
{ fch: '19/11/2020',	cmp:'Factura C	0002-00000101', doc: 'CUIT	30711394989', cae:'70471868675814', value: 2395},			
{ fch: '15/09/2020',	cmp:'Factura C	0002-00000100', doc: 'CUIT	23234544284', cae:'70371327974793', value: 30000},				
{ fch: '13/08/2020',	cmp:'Factura C	0002-00000099', doc: 'CUIT	23234544284', cae:'70331144037468', value: 30000},				
{ fch: '15/07/2020',	cmp:'Factura C	0002-00000098', doc: 'CUIT	23234544284', cae:'70291028051338', value: 30000},				
{ fch: '08/06/2020',	cmp:'Factura C	0002-00000097', doc: 'CUIT	23234544284', cae:'70231768821089', value: 30000},				
{ fch: '10/03/2020',	cmp:'Factura C	0002-00000096', doc: 'CUIT	23234544284', cae:'70101052404326', value: 40000},				
{ fch: '05/02/2020',	cmp:'Factura C	0002-00000095', doc: 'CUIT	23234544284', cae:'70061648764538', value: 40000},				
{ fch: '02/01/2020',	cmp:'Factura C	0002-00000094', doc: 'CUIT	23234544284', cae:'70011262321635', value: 40000},				
{ fch: '03/12/2019',	cmp:'Factura C	0002-00000093', doc: 'CUIT	23234544284', cae:'69491061395823', value: 40000},				
{ fch: '06/11/2019',	cmp:'Factura C	0002-00000092', doc: 'CUIT	23234544284', cae:'69451971780283', value: 40000},				
{ fch: '10/10/2019',	cmp:'Factura C	0002-00000091', doc: 'CUIT	23234544284', cae:'69411912870804', value: 40000},				
{ fch: '09/09/2019',	cmp:'Factura C	0002-00000090', doc: 'CUIT	23234544284', cae:'69361702212542', value: 40000},				
{ fch: '14/08/2019',	cmp:'Factura C	0002-00000089', doc: 'CUIT	23234544284', cae:'69331784171388', value: 40000},				
{ fch: '11/07/2019',	cmp:'Factura C	0002-00000088', doc: 'CUIT	23234544284', cae:'69281652041363', value: 20000},				
{ fch: '03/06/2019',	cmp:'Factura C	0002-00000087', doc: 'CUIT	23234544284', cae:'69221429719118', value: 20000},				
{ fch: '14/05/2019',	cmp:'Factura C	0002-00000086', doc: 'CUIT	23234544284', cae:'69201809114548', value: 20000},				
{ fch: '01/04/2019',	cmp:'Factura C	0002-00000085', doc: 'CUIT	23234544284', cae:'69131590453486', value: 20000},				
{ fch: '01/04/2019',	cmp:'Factura C	0002-00000084', doc: 'CUIT	20103353166', cae:'69131590393305', value: 36000},				
{ fch: '01/03/2019',	cmp:'Factura C	0002-00000083', doc: 'CUIT	23234544284', cae:'69091777577837', value: 20000},				
{ fch: '01/03/2019',	cmp:'Factura C	0002-00000082', doc: 'CUIT	20103353166', cae:'69091777317822', value: 36000},				
{ fch: '04/02/2019',	cmp:'Factura C	0002-00000081', doc: 'CUIT	23234544284', cae:'69051117863709', value: 20000},				
{ fch: '04/02/2019',	cmp:'Factura C	0002-00000080', doc: 'CUIT	20103353166', cae:'69051117819467', value: 36000},				
{ fch: '04/01/2019',	cmp:'Factura C	0002-00000079', doc: 'CUIT	23234544284', cae:'69011374676657', value: 20000},				
{ fch: '04/01/2019',	cmp:'Factura C	0002-00000078', doc: 'CUIT	20103353166', cae:'69011374483483', value: 36000},				
{ fch: '06/12/2018',	cmp:'Factura C	0002-00000077', doc: 'CUIT	23234544284', cae:'68491663703165', value: 27000},				
{ fch: '06/12/2018',	cmp:'Factura C	0002-00000076', doc: 'CUIT	20103353166', cae:'68491663624165', value: 36000},				
{ fch: '07/11/2018',	cmp:'Factura C	0002-00000075', doc: 'CUIT	23234544284', cae:'68451903870694', value: 27000},				
{ fch: '07/11/2018',	cmp:'Factura C	0002-00000074', doc: 'CUIT	20103353166', cae:'68451903868518', value: 36000},				
{ fch: '04/10/2018',	cmp:'Factura C	0002-00000073', doc: 'CUIT	23234544284', cae:'68401090038899', value: 27000},				
{ fch: '04/10/2018',	cmp:'Factura C	0002-00000072', doc: 'CUIT	20103353166', cae:'68401089934473', value: 36000},				
{ fch: '05/09/2018',	cmp:'Factura C	0002-00000071', doc: 'CUIT	23234544284', cae:'68361339777414', value: 27000},				
{ fch: '05/09/2018',	cmp:'Factura C	0002-00000070', doc: 'CUIT	20103353166', cae:'68361339712288', value: 36000},				
{ fch: '09/08/2018',	cmp:'Factura C	0002-00000069', doc: 'CUIT	23234544284', cae:'68321685903948', value: 27000},				
{ fch: '09/08/2018',	cmp:'Factura C	0002-00000068', doc: 'CUIT	20103353166', cae:'68321685869681', value: 36000},				
{ fch: '11/07/2018',	cmp:'Factura C	0002-00000067', doc: 'CUIT	23234544284', cae:'68281975020580', value: 27000},				
{ fch: '11/07/2018',	cmp:'Factura C	0002-00000066', doc: 'CUIT	20103353166', cae:'68281974899865', value: 30000},				
{ fch: '11/06/2018',	cmp:'Factura C	0002-00000065', doc: 'CUIT	23234544284', cae:'68241286648003', value: 9000},			
{ fch: '11/06/2018',	cmp:'Factura C	0002-00000064', doc: 'CUIT	20103353166', cae:'68241286613106', value: 15000},				
{ fch: '10/05/2018',	cmp:'Factura C	0002-00000063', doc: 'CUIT	23234544284', cae:'68191537014070', value: 9000},			
{ fch: '10/05/2018',	cmp:'Factura C	0002-00000062', doc: 'CUIT	20103353166', cae:'68191536950444', value: 15000},				
{ fch: '11/04/2018',	cmp:'Factura C	0002-00000061', doc: 'CUIT	23234544284', cae:'68151841717204', value: 9000},			
{ fch: '11/04/2018',	cmp:'Factura C	0002-00000060', doc: 'CUIT	20103353166', cae:'68151841634268', value: 15000},				
{ fch: '12/03/2018',	cmp:'Factura C	0002-00000059', doc: 'CUIT	23234544284', cae:'68111157266652', value: 9000},			
{ fch: '12/03/2018',	cmp:'Factura C	0002-00000058', doc: 'CUIT	20103353166', cae:'68111157212030', value: 15000},				
{ fch: '14/02/2018',	cmp:'Factura C	0002-00000057', doc: 'CUIT	23234544284', cae:'68071561505561', value: 9000},			
{ fch: '14/02/2018',	cmp:'Factura C	0002-00000056', doc: 'CUIT	20103353166', cae:'68071561425968', value: 15000},				
{ fch: '11/01/2018',	cmp:'Factura C	0002-00000055', doc: 'CUIT	23234544284', cae:'68021870330481', value: 9000},			
{ fch: '11/01/2018',	cmp:'Factura C	0002-00000054', doc: 'CUIT	20103353166', cae:'68021870305644', value: 15000},
]

const totalMes = () => {
  const sanitizeData = data.map( e => {
    const afch = e.fch.split('/');
    const periodo = `${afch[2]}${afch[1]}`;
    return {periodo, value: e.value}
  })
  sanitizeData.sort((a,b) => (a.periodo > b.periodo) ? 1 : ((b.periodo > a.periodo) ? -1 : 0));
  const ret = {}
  let total = 0
  sanitizeData.forEach(e => {
    if (ret[e.periodo]) ret[e.periodo] += e.value;
    else ret[e.periodo] = e.value;
    total += e.value;
  });
  ret['total'] = total;
  ret['renta'] = total * .03 + (total*.03)*.1
  return ret;
/*
  const res = Array.from(sanitizeData.reduce(
    (m, {periodo, value}) => m.set(periodo, (m.get(periodo) || 0) + value), new Map
  ), ([periodo, value]) => ({periodo, value}));
  console.log(res);
  return res;
*/
}

export const totales = (req: Request, res: Response) => {

  res.status(200).json(totalMes())

}
