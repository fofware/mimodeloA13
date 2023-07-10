//https://www.youtube.com/watch?v=gBnrdedhuU4

import { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer"

export const sameep = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //slowMo: 1200
    });
    const page = await browser.newPage();
    /*
    await page.setViewport({
      width: 1280,
      height: 960,
      deviceScaleFactor: 1,
    });
    */
    await page.goto(`http://apps8.chaco.gob.ar/sameepweb/servlet/com.sameep.gamexamplelogin`);
    //await page.goto(`https://quotes.toscrape.com/`);
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
    await new Promise( r => setTimeout(r, 1500));
    console.log(`${page.url()}`);
    /**
     * Todo leer cantidad de paginas
     * Recorrer paginas y despues recorrer clientes en cada página
     */

    /**
     * Esta en una pagina de seleccion de clientes
     * Obtiene cantidad de clientes
     * Y recorre los clientes
     **/

    //const nroClientes = (await page.$$('a[data-gx-evt="5"]')).length;
    const nroClientes = await page.$$eval('a[data-gx-evt="5"]', clients => clients.length);
    console.log(`Cantidad de Clientes ${nroClientes}`)
    for (let i = 0; i < nroClientes; i++) {
      // Obtiene los links de selección de cada cliente de la página
      const links = await page.$$('a[data-gx-evt="5"]');
      // selecciona el link
      const element = links[i];
      console.log(`Click: ${i}`);
      await element.click();
      await new Promise( r => setTimeout(r, 1500));
      // Obtiene link de saldos
      const ltr = await page.$$('span.ReadonlyAttribute > a');
      console.log(ltr)
      await ltr[0].click();
      await new Promise( r => setTimeout(r, 2500));
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
    
    /*
    for (var i=0; i<links.length; i++) {                  // step-3
      const elem = links[i];
      const href = await page.evaluate(e => e.href, elem); //Chrome will return the absolute URL
      const newPage = await browser.newPage();
      console.log(href);
      await newPage.goto(href);
      await new Promise( r => setTimeout(r, 3000));
      await newPage.close();
      console.log(`clicked link = ${i}`);
    }
    */
    //page.click('a[data-gx-evt="5"]')
/*
    const links = await page.evaluate(() => {
      const lnks = document.querySelectorAll('a[data-gx-evt="5"]');
      return lnks
    });
*/
    await new Promise( r => setTimeout(r, 3000));
    await browser.close();
    res.status(200).json(retData);
  } catch (error) {
    console.log(error);    
  }
}