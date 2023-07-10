import { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer"

export const secheep = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //slowMo: 1200
    });
    const page = await browser.newPage();
    
    await page.setViewport({
      width: 1280,
      height: 960,
      deviceScaleFactor: 1,
    });
    
    await page.goto(`https://apps.secheep.com/Secheep.VirtualOffice/#/login`);
    /**
     * Login
     */
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
    await new Promise( r => setTimeout(r, 1500));
    console.log(`${page.url()}`);

    await page.click('a[href="/user/facturas"]'),
    await new Promise( r => setTimeout(r, 2000));
    console.log(`${page.url()}`);
    const nroClientes = await page.$$eval('div.el-select.suministroSelect > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul.el-scrollbar__view.el-select-dropdown__list > li.el-select-dropdown__item', clients => clients.length);
    console.log(`Suministros: ${nroClientes}`);
    const options = await page.$$eval('div.el-select.suministroSelect > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul.el-scrollbar__view.el-select-dropdown__list > li.el-select-dropdown__item > span', options => {
      return options.map(option => option.textContent);
    });
    console.log('Opciones:', options);
    for (let i = 0; i < options.length; i++) {
      const links = await page.$$('div.el-select.suministroSelect > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul.el-scrollbar__view.el-select-dropdown__list > li');
      // selecciona el link
      //const o = await page.$('input[placeholder="Seleccione el suministro"]');
      //const o = options[i]
      //await page.focus('span.el-input__suffix');
      await page.click('span.el-input__suffix');
      await new Promise( r => setTimeout(r, 2000));

      const o = links[i];
      
      await new Promise( r => setTimeout(r, 2000));
      //const inp = await page.$eval('input[placeholder="Seleccione el suministro"]', e => e);
      //inp.textContent = o;
      console.log(options[i]);
      await new Promise( r => setTimeout(r, 2000));
    }
    /**
     * Todo leer cantidad de paginas
     * Recorrer paginas y despues recorrer clientes en cada página
     */

    /**
     * Esta en una pagina de seleccion de clientes
     * Obtiene cantidad de clientes
     * Y recorre los clientes
     **/

    await new Promise( r => setTimeout(r, 13000));
    await browser.close();
    res.status(200).json(retData);
  } catch (error) {
    console.log(error);    
  }
}