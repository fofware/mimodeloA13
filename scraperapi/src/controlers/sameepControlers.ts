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
            return {id: e?.id, value: e?.textContent, display: td.style.display}
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
            e.value = e.value.trim().replace(',','.');
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
          }
        }
        return data;
      })
      resolve(data);
    } catch (error) {
      console.log("CargaTablas",error)
      reject(null)
    }

  })

}

const cargaTablas = ( page:Page, tabla = 'table#Grid1ContainerTbl > tbody > tr' ): Promise<any> => {
  return new Promise( async (resolve, reject) => {
    try {
      const trs = await page.$$eval(tabla, trs => {
        console.log('trs', trs)
        const regs = trs.map( tr => {
          const tds = tr.querySelectorAll('td');
          const row = {}
          const items = [... tds].map( td => {
            const e = td.querySelector('span');
            if(e){
              e.id = e?.id.replace(/^[a-zA-Z]*_/,'');
              e.id = e?.id.replace(/_[0-9]*$/,'');
            }
  
            return {id: e?.id.trim(), value: e?.textContent.trim(), display: td.style.display.trim()}
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

export const sameep = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    let retData = [];
    const browser = await puppeteer.launch({
      headless: false,
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
    console.log(`Cantidad de Clientes ${nroClientes}`)
    retData.push({nroClientes});
    for (let i = 0; i < nroClientes; i++) {
      const links = await page.$$('a[data-gx-evt="5"]');
      console.log(links);
      // selecciona el cliente
      const e = links[i];
      const cliente = await selectClient(page,e);
      console.log({...tb[i], ...cliente})
      retData[i] = {...tb[i], ...cliente};
      await new Promise( r => setTimeout(r, wt));
      await page.goto('http://apps8.chaco.gob.ar/sameepweb/servlet/com.sameep.wpseleccionarcliente');
    }    


    await new Promise( r => setTimeout(r, 3000));
    await browser.close();
    res.status(200).json(retData);
  } catch (error) {
    console.log(error);    
  }
}

const prev = async (page:Page, retData:any) => {
  const nroClientes = 0;
  for (let i = 0; i < nroClientes; i++) {
    // Obtiene los links de selección de cada cliente de la página
    const links = await page.$$('a[data-gx-evt="5"]');
    // selecciona el link
    const element = links[i];
    console.log(`Click: ${i}`);
    await element.click();
    await new Promise( r => setTimeout(r, wt));
    // Obtiene link de saldos
    const ltr = await page.$$('span.ReadonlyAttribute > a');
    console.log(ltr)
    await ltr[0].click();
    await new Promise( r => setTimeout(r, 2500));
    // PeriodosAdeudados
    const nroPaginas = await page.$$eval('ul.pagination > li > a', pgs => pgs.length-1);
    const actualizado = `${await page.$eval('span[id="span_vHOY"]', el => el.innerText)}`;
    console.log(`Actualizado: ${actualizado}`);
    for (let p = 1; p < nroPaginas; p++) {
      await new Promise( r => setTimeout(r, 1000));
      const paginas = await page.$$('ul.pagination > li > a');
      const element = paginas[p];
      await element.click();
      console.log(`Pagina: ${p}`)
      const vencimientos = await page.$$eval('table[id="GridContainerTbl"] > tbody > tr', (vencimiento: HTMLTableRowElement[]) => {
        const vto = [];
        const actualizado = document.getElementById('span_vHOY').innerText;
        const cliente = document.getElementById('span_W0015SOC_NUMERO').innerText;
        const suministro = document.getElementById('span_W0015SUMI_NUMER').innerText;
        const calle = document.getElementById('span_W0015SUMI_CALLE').innerText;
        const nro = document.getElementById('span_W0015SUMI_NROCA').innerText;
        const nombre = document.getElementById('span_W0015SOC_APELLI').innerText;

        vencimiento.map(e => {
          const columnas = e.getElementsByTagName('td');
          console.log('columnas',columnas.length);
          const row = {}
          for (let c = 0; c < columnas.length; c++) {
            const ce = columnas[c];
            const sdata = ce.getElementsByTagName('span');
            for (let d = 0; d < sdata.length; d++) {
              const de = sdata[d];
              const id = de.getAttribute('id');
              const valor = de.innerText;
              row[id] = valor
            }
          }
          row['actualizado'] = actualizado;
          row['cliente'] = cliente;
          row['suministro'] = suministro;
          row['direccion'] = `${calle} ${nro}`
          row['nombre'] = nombre;
          vto.push(row)  
        })
        return vto;
      })
      await new Promise( r => setTimeout(r, 2000));
      retData = [...retData, ...vencimientos]
      console.log(vencimientos)
    }
    await new Promise( r => setTimeout(r, 1000));
    await page.goBack({waitUntil: 'domcontentloaded'});

    await new Promise( r => setTimeout(r, 3000));
    await page.goBack({waitUntil: 'domcontentloaded'});
    await new Promise( r => setTimeout(r, 1500));
  }

}