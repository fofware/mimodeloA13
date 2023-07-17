import { Request, Response, NextFunction } from "express";
import puppeteer, { ElementHandle, Page } from "puppeteer"
const wt = 1000;
const mes = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre:12
}
const getPeriodos = async (page:Page) => {
  const retData = [];
  return new Promise( async (resolve,reject) => {
    const trs = await page.$$eval('div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr', trs => {
      return trs.map( tr => {
        const tds = tr.querySelectorAll('td');
        return {
          factura: tds[0].querySelector('div').textContent,
          estado: tds[1].querySelector('div').textContent,
          vencimiento: tds[2].querySelector('div').textContent,
          periodo: tds[3].querySelector('div').textContent,
          importe: tds[4].querySelector('div').textContent,
        }
      })
    });
    const data = trs.map( r => {
      const tvc = r.vencimiento.split('/');
      const vencimiento = new Date(Number(tvc[2]),Number(tvc[1])-1,Number(tvc[0]),0);
      const tper = r.periodo.split(' ');
      const periodo = `${tper[1]}/${mes[tper[0].toLocaleLowerCase()]}`;
      const importe = Number(r.importe.replace('$',''));
      return {
        factura: r.factura,
        estado: r.estado,
        vencimiento,
        periodo,
        importe
      }
    })
    resolve(data);
  });

}
export const secheep = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox', 
        '--start-maximize',
      //'--start-fullscreen'
    ],
      //slowMo: 1200
    });
    const page = await browser.newPage();
    //await page.setViewport({ width: 1366, height: 768});
    
    await page.setViewport({
      width: 0,
      height: 0,
      deviceScaleFactor: 1,
    });
    
    await page.goto(`https://apps.secheep.com/Secheep.VirtualOffice/#/login`);
    /**
     * Login
     */
    await new Promise( r => setTimeout(r, wt));
    console.log(`${page.url()}`);
    await page.focus('input[placeholder="Correo electrónico"]');
    await page.keyboard.type('fofware@gmail.com');
    await page.focus('input[type="password"]');
    await page.keyboard.type('tamara01');
    let retData = [];
    const [response] = await Promise.all([
      page.waitForNavigation({waitUntil: ['networkidle2']}),
      page.click('div.card-footer.text-center.botonSiguiente > a.btn.btn-primary.btn-round.btn-lg.btn-block'),
    ]);
    // el waitUntil parece no funcionar
    // espero un tiempo
    await new Promise( r => setTimeout(r, wt));
    console.log(`${page.url()}`);
    page.goto('https://apps.secheep.com/Secheep.VirtualOffice/#/user/facturas')
    await new Promise( r => setTimeout(r, wt));
    console.log(`${page.url()}`);
    //await page.goto('a[href="/user/facturas"]'),
    //await new Promise( r => setTimeout(r, wt));
    //console.log(`${page.url()}`);
    
    const nroClientes = await page.$$eval('div.el-select.suministroSelect > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul.el-scrollbar__view.el-select-dropdown__list > li.el-select-dropdown__item', clients => {
      return clients.length
    });
    console.log(`Suministros: ${nroClientes}`);

    const options = await page.$$eval('div.el-select.suministroSelect > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul.el-scrollbar__view.el-select-dropdown__list > li.el-select-dropdown__item > span', options => {
      return options.map(option => option.textContent);
    });
    console.log(`arranca en tabla ${await page.$eval('input.el-input__inner', e => e.value)}`)
    const idx = (await page.$eval('input.el-input__inner', e => e.value)).split('-')
    const suministro = {
      cliente: idx[0].trim(),
      direccion: idx[1].trim()
    }
    suministro['facturas'] = await getPeriodos(page);
    retData.push(suministro);
    let plusTime = 0
    for (let i = 1; i < nroClientes; i++) {
      await page.focus("span.el-input__suffix");
      await page.click("span.el-input__suffix");
      await new Promise( r => setTimeout(r, wt+plusTime));
      //console.log(await page.$eval('span.el-input__suffix', e => e.textContent));

      const links = await page.$$('div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul.el-scrollbar__view.el-select-dropdown__list > li.el-select-dropdown__item');
//      await new Promise( r => setTimeout(r, wt+plusTime));
      links[i+3].click(); // Va siguiente suministro
      
      
      while (await page.$eval('input.el-input__inner', e => e.value) !== options[i]) {
        console.log('espera...');
        await new Promise( r => setTimeout(r, 1000));
      }
      const nropag = await page.$$eval('ul.pagination.col-centered.pagination-default > li', e => e.length);
      console.log(`Nro de Páginas ${nropag-2}`)
      let nextP = false;
      let pgn = 1;
      const idx = (await page.$eval('input.el-input__inner', e => e.value)).split('-')
      let  suministro = {
        cliente: idx[0].trim(),
        direccion: idx[1].trim(),
        facturas: []
      }

      do {
        //console.log(`lee tabla (${i}) ${await page.$eval('input.el-input__inner', e => e.value)}`);
        console.log(`Lee Tabla(${i}) Pagina: ${pgn}/${nropag-2} - ${await page.$eval('input.el-input__inner', e => e.value)}`);
    
        const data:any = await getPeriodos(page);
        suministro['facturas'] = [... suministro['facturas'], ...data]
        await new Promise( r => setTimeout(r, wt));
        console.log(data);
        const nextPage = await page.$('li.page-item.next-page');
        nextP = !(await page.$eval('li.page-item.next-page', e => e.getAttribute('class').includes('disabled')));
        //console.log(`Lee Tabla(${i}) Pagina: ${pgn}/${nropag} - ${options[i]}`);
        if (nextP) {
          pgn++;
          await nextPage.click();
          await new Promise( r => setTimeout(r, wt));
        }
      } while ( nextP );
      retData.push(suministro);
    }
    await new Promise( r => setTimeout(r, 10000));
    await browser.close();
    res.status(200).json(retData);
  } catch (error) {
    console.log(error);    
  }
}