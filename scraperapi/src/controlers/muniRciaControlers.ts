import { Request, Response, NextFunction } from "express";
import puppeteer, { ElementHandle, Page } from "puppeteer"
const wt = 2000;

const cargaTablas = ( page:Page ): Promise<any> => {
  return new Promise( async (resolve, reject) => {
    try {
      const trs = await page.$$eval('table#Grid1ContainerTbl > tbody > tr', trs => {
        return trs.map( tr => {
          const tds = tr.querySelectorAll('td');
          return [... tds].map( td => {
            const e = td.querySelector('span');
            return {id: e?.id, value: e?.textContent, display: td.style.display}
          })
        })
      });
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
      console.log(error)
      reject()
    }

  })

}

const vehiculoData = ( page:Page): Promise<any> => {
  const veiculos = [
    'span_vVEHCHAPA',
    'span_vCATEGORIA',
    'span_vMARCA',
    'span_vMODELO',
    'span_vNOMBRE',
    'span_vCUIT',
    'span_vTIPOCNT',
    'span_vCODLINKPGO'
  ]

  return new Promise( async (resolve, reject) => {
    try {
      const data = {
        chapa: await page.$eval('span#span_vVEHCHAPA', v => v.textContent),
        categoria: await page.$eval('span#span_vCATEGORIA', v => v.textContent),
        marca: await page.$eval('span#span_vMARCA', v => v?.textContent),
        modelo: await page.$eval('span#span_vMODELO', v => v.textContent),
        nombre: await page.$eval('span#span_vNOMBRE', v => v.textContent),
        cuit: await page.$eval('span#span_vCUIT', v => v.textContent),
        tipo: await page.$eval('span#span_vTIPOCNT', v => v.textContent),
        cod_link: await page.$eval('span#span_vCODLINKPGO', v => v.textContent),
        patente: await cargaTablas(page)
      }
      resolve(data);
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}
const getLinks = async (element:ElementHandle<HTMLDivElement>): Promise<any> => {
  return new Promise( async (resolve, reject) => {
    try {
      const options = await element.$$eval('img[src="/MRPAGOS/static/Resources/veramarillo.png"]', options => {
        return options.map(option => {
          return {id: option.id, display: option.style.display}
        });
      })
      resolve(options)      
    } catch (error) {
      console.log(error);
      reject([])
    }
  });
}
const getLinksPagos = async (element:ElementHandle<HTMLDivElement>): Promise<any> => {
  return new Promise( async (resolve, reject) => {
    try {
      const options = await element.$$eval('img[src="/MRPAGOS/static/Resources/CreditCard32.png"', options => {
        return options.map( option => {
          const id = option.id.split('_')[1];
          return {
            /*
            CONCEPTO: await element.$eval(`#span_CONCEPTO_${id}`, v => v.textContent),
            VEPEMIANO: await element.$eval(`#span_VEPEMIANO_${id}`, v => v.textContent),
            VTOVEP: await element.$eval(`#span_VTOVEP_${id}`, v => v.textContent),
            VEPEMINRO: await element.$eval(`#span_VEPEMINRO_${id}`, v => v.textContent),
            VEPORDBOL: await element.$eval(`#span_VEPORDBOL_${id}`, v => v.textContent),
            IMPORTEPESOS: await element.$eval(`#span_IMPORTEPESOS_${id}`, v => v.textContent),
            USUARIO: await element.$eval(`#span_USUARIO_${id}`, v => v.textContent),
            RED: await element.$eval(`#span_RED_${id}`, v => v.textContent),
            */
            click: option.id,
            display: option.style.display
          }
        });
      })

      for (let i = 0; i < options.length; i++) {
        const e:any = options[i];
        const id = e.click.split('_');
        e['CONCEPTO'] = (await element.$eval(`#span_CONCEPTO_${id[1]}`, v => v.textContent)).trim();
        e['VEPEMIANO'] = (await element.$eval(`#span_VEPEMIANO_${id[1]}`, v => v.textContent)).trim();
        e['VTOVEP'] = (await element.$eval(`#span_VTOVEP_${id[1]}`, v => v.textContent)).trim();
        e['VEPEMINRO'] = (await element.$eval(`#span_VEPEMINRO_${id[1]}`, v => v.textContent)).trim();
        e['VEPORDBOL'] = (await element.$eval(`#span_VEPORDBOL_${id[1]}`, v => v.textContent)).trim();
        e['IMPORTEPESOS'] = (await element.$eval(`#span_IMPORTEPESOS_${id[1]}`, v => v.textContent)).trim();
        e['USUARIO'] = (await element.$eval(`#span_USUARIO_${id[1]}`, v => v.textContent)).trim();
        e['RED'] = (await element.$eval(`#span_RED_${id[1]}`, v => v.textContent)).trim();
      }

      resolve(options)      
    } catch (error) {
      console.log(error);
      reject([])
    }
  });
}

const inmuebleData = async (page:Page, options, rdata) => {
  return new Promise( async (resolve, reject) => {
    try {
    const retPage = page.url();

    for (let i = 0; i < options.length; i++) {
      console.log(options[i].id);
      if (options[i].display === '' ){
        const element = `img#${options[i].id}`;
        await page.click(element);
        await new Promise( r => setTimeout(r, wt));
        const data = {
        nombre: await page.$eval('span#span_vNOMBRE', v => v.textContent),
        nro_doc: await page.$eval('span#span_vNRODOC', v => v.textContent),
        cuit: await page.$eval('span#span_vCNTCUIT', v => v.textContent),
        contribuyente_tipo: await page.$eval('span#span_vCNTTIPO', v => v.textContent),
        domicilio: await page.$eval('span#span_vDOMICILIO', v => v.textContent),
        calle: '',
        altura: '',
        nomenclatura: await page.$eval('span#span_vVNOMEN', v => v.textContent),
        unidad: await page.$eval('span#span_vVUNI', v => v.textContent),
        padron: await page.$eval('span#span_INMPADRON', v => v.textContent),
        inmobiliario: [],
        tasa: []
        }
        console.log('Lee InmoData')
        data['inmobiliario'] = await cargaTablas(page);
        page.click('span#TBTASAS');
        await new Promise( r => setTimeout(r, wt));
        data['calle'] = await page.$eval('span#span_vVCALLE', v => v.textContent),
        data['altura'] =  await page.$eval('span#span_vVALTU', v => v.textContent),
        console.log('Lee TasasData')
        data['tasa'] = await cargaTablas(page);
        rdata.push(data);
        page.goto(retPage);
        page.waitForNavigation()
        await new Promise( r => setTimeout(r, wt));
      }
    }
      resolve(true)
    } catch (error) {
      console.log(error);
      reject(false);      
    }
  })
}
const indusGetTributo = async (page:Page, tabla ) => {
          // tributo 62 periodos
  return new Promise( async (resolve, reject) =>{
    const trs = await page.$$eval(tabla, trs => {
      console.log('trs', trs)
      const regs = trs.map( tr => {
        const tds = tr.querySelectorAll('td');
        const row = {}
        const items = [... tds].map( td => {
          const e = td.querySelector('span');
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
    resolve( trs );

  });
}
const industriaData = async (page:Page, options, retData ) => {
  return new Promise( async (resolve, reject ) => {
    try {
      const retPage = `${page.url()}`;

      for (let i = 0; i < options.length; i++) {
        console.log(options[i].id);
        if (options[i].display === '' ){
          const element = `img#${options[i].id}`;
          await page.click(element);
          await new Promise( r => setTimeout(r, wt));
          // encabezamiento
          const enca = await page.$('table#TABLE2 > tbody'); 
          const main = await page.$('table#TABLE3 > tbody');
          const idata = {
            legajo: await enca.$eval('span#TBLEGAJO', v => v.textContent),
            local: await enca.$eval('span#TBLOCAL', v => v.textContent),
            contribuyente: await enca.$eval('span#span_CONCOD', v => v.textContent),
            inicio: await enca.$eval('span#span_vCOMFEC', v => v.textContent),
            calle: await enca.$eval('span#span_vCALLE', v => v.textContent),
            altura: await enca.$eval('span#span_vCNTALTURA', v => v.textContent),
            inicio_local: await enca.$eval('span#span_vCOMFECLOC', v => v.textContent),
            ubicacion: await enca.$eval('span#span_vCALLEDSCL', v => v.textContent),
            tributos: [
              {
                id: await main.$eval('span#TEXTBLOCK7', v => v.textContent),
                name: await main.$eval('span#TEXTBLOCK6', v => v.textContent),
                periodos: await indusGetTributo(page, 'table#Grid6ContainerTbl > tbody > tr')
              },
              {
                id: await main.$eval('span#TEXTBLOCK8', v => v.textContent),
                name: await main.$eval('span#TEXTBLOCK2', v => v.textContent),
                periodos: await indusGetTributo(page, 'table#Grid62ContainerTbl > tbody > tr')
              },
              {
                id: (await main.$eval('span#TEXTBLOCKMULTA', v => v.textContent)).split(' ')[0],
                name: (await main.$eval('span#TEXTBLOCKMULTA', v => v.textContent)).split(' ')[1],
                periodos: await indusGetTributo(page, 'table#GridajusteContainerTbl > tbody > tr')
              },
              {
                id: (await main.$eval('span#TEXTBLOCKAJUSTE', v => v.textContent)).split(' ')[0],
                name: (await main.$eval('span#TEXTBLOCKAJUSTE', v => v.textContent)).split(' ')[1],
                periodos: await indusGetTributo(page, 'table#GridmultaContainerTbl > tbody > tr')
              },
              
            ]
          }
          retData.push(idata);
          console.log(retPage);
          page.goto(retPage);
          page.waitForNavigation()
          await new Promise( r => setTimeout(r, wt));
        }
      }
      resolve(true);
    } catch (error) {
      
    }
  })
}
/*
const inmoData = ( page:Page): Promise<any> => {
  const inmo = [
    'span_vNOMBRE',
    'span_vNRODOC',
    'span_vCNTCUIT',
    'span_vCNTTIPO',
    'span_vDOMICILIO',
    'span_vVNOMEN',
    'span_vVUNI',
    'span_INMPADRON'
  ]

  const tasas = [
    'span_vNOMBRE',
    'span_vNRODOC',
    'span_vCNTCUIT',
    'span_vCNTTIPO',
    'vVCALLE',
    'vVALTU',
    'vVNOMEN',
    'vVUNI',
    'INMPADRON'
  ]


  return new Promise( async (resolve, reject) => {
    try {
      const data = {
        nombre: await page.$eval('span#span_vNOMBRE', v => v.textContent),
        nro_doc: await page.$eval('span#span_vNRODOC', v => v.textContent),
        cuit: await page.$eval('span#span_vCNTCUIT', v => v.textContent),
        contribuyente_tipo: await page.$eval('span#span_vCNTTIPO', v => v.textContent),
        domicilio: await page.$eval('span#span_vDOMICILIO', v => v.textContent),
        calle: await page.$eval('span#span_vCALLE', v => v.textContent),
        altura: await page.$eval('span#span_vVALTU', v => v.textContent),
        nomenclatura: await page.$eval('span#span_vVNOMEN', v => v.textContent),
        unidad: await page.$eval('span#_', v => v.textContent),
        padron: await page.$eval('span#span_INMPADRON', v => v.textContent),
        rows: await cargaTablas(page)
      }
      resolve(data);
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}
*/
/*
const tasaData = ( page:Page): Promise<any> => {
  const inmo = [
    'span_vNOMBRE',
    'span_vNRODOC',
    'span_vCNTCUIT',
    'span_vCNTTIPO',
    'span_vDOMICILIO',
    'span_vVNOMEN',
    'span_vVUNI',
    'span_INMPADRON'
  ]

  const tasas = [
    'span_vNOMBRE',
    'span_vNRODOC',
    'span_vCNTCUIT',
    'span_vCNTTIPO',
    'span_vVCALLE',
    'span_vVALTU',
    'span_vVNOMEN',
    'span_vVUNI',
    'span_INMPADRON'
  ]


  return new Promise( async (resolve, reject) => {
    try {
      const data = {
        nombre: await page.$eval('span#span_vNOMBRE', v => v.textContent),
        nro_doc: await page.$eval('span#span_vNRODOC', v => v.textContent),
        cuit: await page.$eval('span#span_vCNTCUIT', v => v.textContent),
        contribuyente_tipo: await page.$eval('span#span_vCNTTIPO', v => v.textContent),
        calle: await page.$eval('span#span_vCALLE', v => v.textContent),
        altura: await page.$eval('span#span_vVALTU', v => v.textContent),
        nomenclatura: await page.$eval('span#span_vVNOMEN', v => v.textContent),
        unidad: await page.$eval('span#_', v => v.textContent),
        padron: await page.$eval('span#span_INMPADRON', v => v.textContent),
        rows: await cargaTablas(page)
      }
      resolve(data);
    } catch (error) {
      console.log(error)
      reject()
    }
  })
}
*/
const doLink = async (page:Page,options,data,func) => {
  return new Promise( async (resolve, reject) => {
    try {
      const retPage = page.url();

      for (let i = 0; i < options.length; i++) {
        console.log(options[i].id);
        if (options[i].display === '' ){
          const element = `img#${options[i].id}`;
          await page.click(element);
          await new Promise( r => setTimeout(r, wt));
          data.push(await func(page));
          page.goto(retPage);
          page.waitForNavigation()
          await new Promise( r => setTimeout(r, wt));
        }
      }
      resolve(true);
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
}

export const munircia = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
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
    await page.goto(`https://mrpagos.resistencia.gob.ar/MRPAGOS/servlet/com.mr.login`);
    /**
     * Login
     */
    console.log(`${page.url()}`);
    await page.focus('input#vCNTCUIT');
    await page.keyboard.type('20161192741');
    await page.focus('input#vPASS');
    await page.keyboard.type('tamara01');
    let retData = {
      vehiculos: [],
      inmuebles: [],
      industria: [],
    };
    const [response] = await Promise.all([
      page.waitForNavigation({waitUntil: ['networkidle2']}),
      page.click('input#BUTTON1'),
    ]);
    /**
     * Tablas...
     * GridvehiculosContainerDiv - GridvehiculosContainerTbl - Vehiculos
     * GridactasContainerDiv - GridactasContainerTbl - Actas / Vehiculos
     * GridcementerioContainerDiv - GridcementerioContainerTbl - Cementerio
     * GridinmobiliContainerDiv - GridinmobiliContainerTbl - Inmuebles
     * GridplanesContainerDiv - GridplanesContainerTbl - planes de pago
     * GridindustriaContainerDiv - GridindustriaContainerTbl - Comercios
     * GridbromatologiaContainerDiv - Bromatologia actas
     * GridcontribucionContainerDiv - ?
     * GridbolvarContainerDiv - Grid2ContainerTbl - Vencimientos
     * Pagos
     * 
     * GridvepContainerDiv - GridvepContainerTbl - pagos
     * GridbolvarContainerTbl - tabla item de pagos
     */
    // el waitUntil parece no funcionar
    // espero un tiempo
    // posible solucion
    // https://stackoverflow.com/questions/71503214/puppeteer-waitforresponse-timeout-but-page-onresponse-finds-response
    await new Promise( r => setTimeout(r, 1500));
    console.log(`${page.url()}`);
  
    //Vehiculos
    const vehi = await page.$('div#GridvehiculosContainerTbl');
    const options = await getLinks(vehi);
    await doLink( page,options, retData.vehiculos, vehiculoData)
    //Inmuebles
    const inmu = await page.$('div#GridinmobiliContainerTbl');
    const optinmu = await getLinks(inmu);
    await inmuebleData(page,optinmu,retData.inmuebles)

    const indus = await page.$('div#GridindustriaContainerTbl');
    const optind = await getLinks(indus);
    await industriaData(page, optind, retData.industria);

    
    // Pagos
    const pagos = await page.$('div#GridvepContainerDiv');
    await new Promise( r => setTimeout(r, wt));
    const optpagos = await getLinksPagos(pagos);
    for (let i = 0; i < optpagos.length; i++) {
      const el = optpagos[i];
      await page.click(`#${el.click}`);
      await new Promise( r => setTimeout(r, wt));
      const link = await page.$eval('iframe#gxp0_ifrm', v => v.src);
      el['url'] = link;
      await page.click('#gxp0_cls')
      await new Promise( r => setTimeout(r, wt));
    }
    retData['pagos'] = optpagos;
    /*
    const pagos = await page.$$eval('img[src="/MRPAGOS/static/Resources/CreditCard32.png"]', options => {
      return options.map(option => {
        //if (option.style.display === '') 
        return {id: option.id, display: option.style.display}
      });
    });
    console.log(options);
    */
    
    await new Promise( r => setTimeout(r, wt));
    await browser.close();
    res.status(200).json(retData);
  } catch (error) {
    console.log(error);    
  }
}
