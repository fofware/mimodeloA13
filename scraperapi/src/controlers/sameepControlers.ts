//https://www.youtube.com/watch?v=gBnrdedhuU4

import { Request, Response, NextFunction } from "express";
import puppeteer, { ElementHandle, Page } from "puppeteer"
const wt = 1500;

const listaClients = ( page:Page, tabla = 'table#Grid1ContainerTbl > tbody > tr' ): Promise<any> => {
  return new Promise( async (resolve, reject) => {
    try {
      const trs = await page.$$eval(tabla, trs => {
        return trs.map( tr => {
          const tds = tr.querySelectorAll('td');
          return [... tds].map( td => {
            const e = td.querySelector('span');
            const a = e?.querySelector('a');
            const value = a ? a.href : e?.textContent.trim();
            return {id: e?.id, value}
          })
        })
      });
      //console.log('trs',trs);
      const data = trs.map( linea => {
        const data = {};
        for (let i = 0; i < linea.length; i++) {
          const e = linea[i];

          if(e.id){
            e.id = (e.id.split('_'))[1];
            //e.value = e.value.trim().replace(',','.');
            /*
            let value:any;//
            const fch  = e.value.split('/');
            if (fch.length === 3){
              if(fch[2].length === 2) fch[2] = `20${fch[2]}`
              value = new Date( Number(fch[2]),Number(fch[1])-1,Number(fch[0]),0,0,0);
            } else {
              //value = isNaN(parseFloat(e.value)) ? e.value : parseFloat(e.value).toFixed(2);
              value = isNaN(parseFloat(e.value)) ? e.value : Number(e.value);
            }
            data[e.id] = value;
            */
            data[e.id] = e.value;
          }
        }
        return data;
      })
      resolve(data);
    } catch (error) {
      console.log("listaClients",error)
      reject(null)
    }
  })
}

const selectClient = async (page:Page, client:ElementHandle<HTMLAnchorElement>) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      /**
       * Select Cliente
       */
      console.log(`${page.url()}`);
      const [response] = await Promise.all([
        page.waitForNavigation({waitUntil: ['networkidle2']}),
        client.click()
      ]);
      await new Promise( r => setTimeout(r, wt));
      const W0018SOC_APELLI = await page.$eval('span#span_W0018SOC_APELLI', e => e.textContent);

      const data = {W0018SOC_APELLI,  ...(await cargaTablas(page, 'table#GridContainerTbl > tbody > tr'))};
      resolve(data);
    } catch (error) {
      console.log(error);
      reject(false)
    }
  });
}

const getFields = ( page:Page, tabla = 'table#Grid1ContainerTbl > tbody > tr' ): Promise<any> => {
  return new Promise( async (resolve, reject) => {
    try {
      const trs = await page.$$eval(tabla, trs => {
        return trs.map( tr => {
          const tds = tr.querySelectorAll('td');
          return [... tds].map( (td, idx) => {
            const e = td.querySelector('span');
            
            const a = td?.querySelector('a');
            const inp = td?.querySelector('input');
            const img = td?.querySelector('img');
            
            let id = e?.id  || a?.id || inp?.id || img?.id || `desconocido_${idx}`
            let value = e?.textContent  || a?.href || inp?.value || img?.src || `desconocido_${idx}`;
            id = id.replace(/_[0-9]*$/,'').replace(/^[a-zA-Z]*_/,'');
            value = value.trim()
            console.log(id, value);
            return { id, value }
          })
        })
      });
      const data = trs.map( linea => {
        const data = {};
        for (let i = 0; i < linea.length; i++) {
          const e = linea[i];
          data[e.id] = e.value;
        }
        return data;
      });
      resolve(data);
    } catch (error) {
      console.log("getFields",error)
      reject(null)
    }
  })
}

const cargaTablas = ( page:Page, tabla = 'table#GridContainerTbl > tbody > tr' ): Promise<any> => {
  return new Promise( async (resolve, reject) => {
    try {
      const trs = await page.$$eval(tabla, trs => {
        console.log('trs', trs)
        const regs = trs.map( tr => {
          const tds = tr.querySelectorAll('td');
          const row = {}
          const items = [... tds].map( (td, i) => {
            const e = td.querySelector('span');
            let id = `cargaTablas_${i}`;
            let value = '';
            if(e){

              e.id = e?.id.replace(/^[a-zA-Z]*_+/,'');
              e.id = e?.id.replace(/_[0-9]*$/,'');
              id = e.id;
              value = e.textContent.trim();
              const img = e.querySelector('img');
              if(img && id === `cargaTablas_${i}`) id = img?.id.replace(/_[0-9]*$/,'');

            }
            const a = td.querySelector('a');
            if(a){
              const img = a.querySelector('img');
              value = a.href;
              if(img){
                if(id === `cargaTablas_${i}`) id = img?.id
                id = id.replace(/_[0-9]*$/,'');
              }
            }
            //const value = a ? a?.href : e?.textContent.trim();
            return {id, value}
          })
          for (let i = 0; i < items.length; i++) {
            const e = items[i];
            row[e.id] = e.value;
          }
          return row;
        })
        return regs
      });
      resolve(trs[0]);
    } catch (error) {
      console.log("CargaTablas",error)
      reject(null)
    }

  })
}

const saldos = async (page:Page, link:string) => {
  return new Promise ( async (resolve, reject) => {
    try {
      await page.goto(link);
      await new Promise( r => setTimeout(r, wt));
      const fecha = await page.$eval('span#span_vHOY', e => {
        const tbfch = (e.textContent).split('/');
        return `20${tbfch[2]}/${tbfch[1]}/${tbfch[0]}`;
      })
      const actualizado = new Date(fecha);
      console.log(actualizado)
      let data = []
      let next = false;
      do {
        data = [...data, ...await getFields(page, 'table#GridContainerTbl > tbody > tr')];
        const btn = await page.$('li.next');
        next = await btn.evaluate( e => {
          const disa = e.getAttribute('class').includes('disabled');
          return !disa;
        });
        console.log('Next', next);
        if(next) {
          await btn.click();
          await new Promise( r => setTimeout(r, wt));
        }

      } while (next);
      //const actualizado = document.getElementById('span_vHOY').innerText;
      const retData = []
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        const retel:any = {};
        const tbFch = el['COMP_FECHA'].split('/');
        const tbPeriodo = el['COMSALPERIODO'].split('/');
        const tbVto = el['COMP_VTO1'].split('/');
        retel.id = el['COMSALFORMULAID'];
        retel.comprobante = `${el['FORM_DESCR']} ${el['COMP_LETRA']} ${el['COMP_SECCI']}-${el['COMP_NUMER']}`
        retel.fecha = new Date(`${tbFch[2]}/${tbFch[1]}/${tbFch[0]}`);
        retel.vtoFch = new Date(`${tbVto[2]}/${tbVto[1]}/${tbVto[0]}`);
        retel.periodo = `${tbPeriodo[1]}/${tbPeriodo[0]}`;
        retel.importe = Number(el['SALDO'].replace('.','').replace(',','.'));
        retel.recargo = Number(el['INTERESES'].replace('.','').replace(',','.'));
        retel.total = Number(el['SALDO_TOTAL'].replace('.','').replace(',','.'));
        retel.data = el;
        retData.push(retel)
      }
      resolve({retData,actualizado});
    } catch (error) {
      reject(`Error al leer saldos ${error} ${link}`)
    }
  });
}

const consumos = async (page:Page, link:string) => {
  return new Promise ( async (resolve, reject) => {
    try {
      await page.goto(link);
      await new Promise( r => setTimeout(r, wt));
      await page.click('button#DDO_MANAGEFILTERSContainer_btnGroupDrop')
      const dropmenu = await page.$('div#DDO_MANAGEFILTERSContainer');
      const btn = await dropmenu.$('button');
      console.log('button')
      btn.click()
      await new Promise( r => setTimeout(r, wt));
      const limpia = await dropmenu.$('a');
      console.log(limpia);
      await limpia.focus();
      await limpia.click();
      await new Promise( r => setTimeout(r, wt));

      let data = []
      let next = false;
      
      do {
        data = [...data, ...await getFields(page, 'table#GridContainerTbl > tbody > tr')];
        const btn = await page.$('li.next');
        next = await btn.evaluate( e => {
          const disa = e.getAttribute('class').includes('disabled');
          return !disa;
        });
        console.log('Next', next);
        if(next) {
          await btn.click();
          await new Promise( r => setTimeout(r, wt));
        }

      } while (next);
      //const actualizado = document.getElementById('span_vHOY').innerText;
      const retData = []
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        const retel:any = {};
        /*
        const tbFch = el['COMP_FECHA'].split('/');
        const tbPeriodo = el['COMSALPERIODO'].split('/');
        const tbVto = el['COMP_VTO1'].split('/');
        retel.id = el['COMSALFORMULAID'];
        retel.comprobante = `${el['FORM_DESCR']} ${el['COMP_LETRA']} ${el['COMP_SECCI']}-${el['COMP_NUMER']}`
        retel.fecha = new Date(`${tbFch[2]}/${tbFch[1]}/${tbFch[0]}`);
        retel.vtoFch = new Date(`${tbVto[2]}/${tbVto[1]}/${tbVto[0]}`);
        retel.periodo = `${tbPeriodo[1]}/${tbPeriodo[0]}`;
        retel.importe = Number(el['SALDO'].replace('.','').replace(',','.'));
        retel.recargo = Number(el['INTERESES'].replace('.','').replace(',','.'));
        retel.total = Number(el['SALDO_TOTAL'].replace('.','').replace(',','.'));
        */
        retel.data = el;
        retData.push(retel)
      }
      resolve(retData);
    } catch (error) {
      reject(`Error al leer consumos ${error} ${link}`)
    }
  });
}

const login = async (page:Page) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      /**
       * Login
       */
      console.log(`${page.url()}`);
      await page.focus('#vUSERNAME');
      await page.keyboard.type('fofware');
      await page.focus('#vUSERPASSWORD');
      await page.keyboard.type('tamara01');
      let retData = [];
      const [response] = await Promise.all([
        page.waitForNavigation({waitUntil: ['networkidle2']}),
        page.click('input[id="BTNENTER"]'),
      ]);
      // el waitUntil parece no funcionar
      // espero un tiempo
      //await page.waitForResponse('http://apps8.chaco.gob.ar/sameepweb/servlet/com.sameep.wpseleccionarcliente')
      //await new Promise( r => setTimeout(r, wt));
      resolve(true);
    } catch (error) {
      console.log(error);
      reject(false)
    }
  });
}


export const sameep = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    let retData = [];
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox', 
        '--start-maximize',
      ],
      //slowMo: 1200
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 0,
      height: 0,
      deviceScaleFactor: 1,
    });
    await page.goto(`http://apps8.chaco.gob.ar/sameepweb/servlet/com.sameep.gamexamplelogin`);
    console.log(`${page.url()}`);
    await login(page);    
    await new Promise( r => setTimeout(r, wt));

    //const nroClientes = (await page.$$('a[data-gx-evt="5"]')).length;
    const nroClientes = await page.$$eval('a[data-gx-evt="5"]', clients => clients.length);
    const tb = await listaClients(page, 'table#GridContainerTbl > tbody > tr');
    console.log(tb);
    console.log(`Cantidad de Clientes ${tb.length}`)
    for (let i = 0; i < tb.length; i++) {
    
      const links = await page.$$('a[data-gx-evt="5"]');
      console.log(links);
      // selecciona el cliente
      const e = links[i];
      const cliente = await selectClient(page,e);
      retData[i] = {...tb[i], ...cliente};
      if(i < tb.length-1){
        await new Promise( r => setTimeout(r, wt));
        await page.goto('http://apps8.chaco.gob.ar/sameepweb/servlet/com.sameep.wpseleccionarcliente');
      }
    }
    console.log(retData);    
    for (let n = 0; n < retData.length; n++) {
      const cl = retData[n];
      const saldo:any = await saldos(page,cl.vSALDO);
      cl.fch_saldo = saldo.actualizado;
      cl.vSALDO = saldo.retData;
      await new Promise( r => setTimeout(r, wt));
      /**
       * Consumos
       */
      //cl.vCONSUMOS = await consumos(page, cl.vCONSUMOS);
      //await new Promise( r => setTimeout(r, wt));
      /*
      await page.goto(cl.vRECLAMOS);
      await new Promise( r => setTimeout(r, wt+5000));
      await page.goto(cl.vVERINTIMACION);
      await new Promise( r => setTimeout(r, wt+5000));
      */
    }


    await new Promise( r => setTimeout(r, 3000));
    await browser.close();
    res.status(200).json(retData);
  } catch (error) {
    console.log(error);    
  }
}
