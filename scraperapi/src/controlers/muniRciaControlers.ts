import { Request, Response, NextFunction, json } from "express";
import puppeteer, { ElementHandle, Page } from "puppeteer"
const wt = 3500;

const cargaTablas = ( page:Page, tabla = 'table#Grid1ContainerTbl > tbody > tr' ): Promise<any> => {
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

const vehiculoData = ( page:Page): Promise<any> => {
  
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
        patente: await cargaTablas(page,'table#Grid1ContainerTbl > tbody > tr')
      }
      resolve(data);
    } catch (error) {
      console.log("VehiculoData",error)
      reject(null)
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
      console.log("getLinks",error);
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
      console.log("getLinksPagos",error);
      reject([])
    }
  });
}

const inmuebleData = async (page:Page, options) => {
  return new Promise( async (resolve, reject) => {
    try {
    const retPage = page.url();
    const rdata = [];
    for (let i = 0; i < options.length; i++){
      //console.log(options[i].id);
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
      resolve(rdata)
    } catch (error) {
      console.log("inmuebleData",error);
      reject(null);      
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
    resolve( trs );

  });
}
const industriaData = async (page:Page, options ) => {
  return new Promise( async (resolve, reject ) => {
    const retData = [];
    try {
      const retPage = `${page.url()}`;

      for (let i = 0; i < options.length; i++) {
        //console.log(options[i].id);
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
          //console.log(retPage);
          page.goto(retPage);
          page.waitForNavigation()
          await new Promise( r => setTimeout(r, wt));
        }
      }
      resolve(retData);
    } catch (error) {
      console.log("industriaData",error);
      reject([]);
    }
  })
}

const doLink = async (page:Page,options,func) => {
  return new Promise( async (resolve, reject) => {
    const data = [];
    try {
      const retPage = page.url();
      for (let i = 0; i < options.length; i++) {
        //console.log(options[i].id);
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
      resolve(data);
    } catch (error) {
      console.log("doLink",error);
      reject(false);
    }
  });
}
const getVehiculosData = async (page:Page) => {
  return new Promise( async (resolve, reject) => {
    try {
      //const retData = [];
      const vehi = await page.$('div#GridvehiculosContainerTbl');
      const options = await getLinks(vehi);
      const retData = await doLink( page,options, vehiculoData)
  
      resolve(retData)
    } catch (error) {
      console.log("getVehiculosData",error);
      reject()    
    }
  })
}

const getInmueblesData = async (page:Page) => {
  return new Promise( async (resolve, reject) => {
    try {
      const inmu = await page.$('div#GridinmobiliContainerTbl');
      const optinmu = await getLinks(inmu);
      const retData = await inmuebleData(page,optinmu)
      resolve(retData)
    } catch (error) {
      console.log("getInmueblesData",error);
      reject()    
    }
  })
}

const getIndustriaComercio = async (page:Page) => {
  return new Promise( async (resolve, reject) => {
    try {
      const indus = await page.$('div#GridindustriaContainerTbl');
      const optind = await getLinks(indus);
      const retData = await industriaData(page, optind);
      resolve(retData);
    } catch (error) {
      console.log("getIndustriaComercio", error)
      reject([])
    }
  })
}
const getPagos = async (page:Page) => {
  return new Promise ( async (resolve, reject) => {
    try {
      const pagos = await page.$('div#GridvepContainerDiv');
      await new Promise( r => setTimeout(r, wt));
      const optpagos = await getLinksPagos(pagos);
      const retPage = `${page.url()}`;
      for (let i = 0; i < optpagos.length; i++) {
        const el = optpagos[i];
        await page.click(`#${el.click}`);
        await new Promise( r => setTimeout(r, wt));
        const link = await page.$eval('iframe#gxp0_ifrm', v => v.src);
        el['url'] = link;
    
        page.goto(link)
        await new Promise( r => setTimeout(r, wt));
        el['referencia'] = await page.$eval('#span_VARPADRON', v => v.textContent);
        el['detalle'] = await cargaTablas(page,'#GridbolvarContainerTbl > tbody > tr');
        page.goto(retPage);
        await new Promise( r => setTimeout(r, wt));
      }
      resolve(optpagos)
    } catch (error) {
      console.log("getPagos",error)
      reject(null)
    }
  })
}
export const loginMuniRcia = (page:Page) => {
  return new Promise( async (resolve, reject ) => {
    try {
      /**
       * Login
       */
      await page.goto(`https://mrpagos.resistencia.gob.ar/MRPAGOS/servlet/com.mr.login`);
      console.log(`${page.url()}`);
      console.log('Logueando')
      await page.focus('input#vCNTCUIT');
      await page.keyboard.type('20161192741');
      await page.focus('input#vPASS');
      await page.keyboard.type('tamara01');
      
      let retData = {};
      const [response] = await Promise.all([
        page.waitForNavigation({waitUntil: ['networkidle2']}),
        page.click('input#BUTTON1'),
      ]);
      await new Promise( r => setTimeout(r, wt));
      resolve(true);        
    } catch (error) {
      reject(false);
    }
  })  
}

export const web_munirciaInmuebles = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  res.status(200).json(await munirciaInmuebles());
}

export const munirciaInmuebles = async (): Promise<any> => {
  let retData = {};
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //slowMo: 1200
    });
    const page = await browser.newPage();

    if (await loginMuniRcia(page)){
      retData['inmuebles'] = await getInmueblesData(page);
    } else {
      retData['error'] = 'No se pudo loguear';
    }
    await browser.close();
    return retData;
  } catch (error) {
    console.log(error);
    retData['error'] = JSON.stringify(error);
  }
} 
export const web_munirciaVehiculos = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  res.status(200).json(await munirciaVehiculos());
}

export const munirciaVehiculos = async (): Promise<any> => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //slowMo: 1200
    });
    const page = await browser.newPage();
    let retData = {};

    if (await loginMuniRcia(page)){
      retData['vehiculos'] = await getVehiculosData(page);
    } else {
      retData['error'] = 'No se pudo loguear';
    }

    await browser.close();
    return retData;
  } catch (error) {
    console.log(error);    
  }
} 

export const munircia = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //slowMo: 1200
    });
    const page = await browser.newPage();
    
    /*
    page.on('requestfailed', request => {
      console.log(`url: ${request.url()}, errText: ${request.failure().errorText}, method: ${request.method()}`)
    });
    */
    /*
    page.on('console', msg => {
      console.log('Logger:', msg.type());
      console.log('Logger:', msg.text());
      console.log('Logger:', msg.location());

    });
    */
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
    let retData = {};
    if (await loginMuniRcia(page)){
      retData['vehiculos'] = await getVehiculosData(page);
      retData['inmuebles'] = await getInmueblesData(page);
      retData['industria'] = await getIndustriaComercio(page);
      retData['pagos'] = await getPagos(page);
    } else {
      retData['error'] = 'No se pudo loguear';
    }

    await browser.close();
    res.status(200).json(retData);
  } catch (error) {
    console.log(error);    
  }
}
