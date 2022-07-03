import { Request, Response, Router } from "express";
import presentacion, { IPresentacion } from "../models/presentaciones";
import articulo from "../models/_articulos";
import fabricantes from "../models/fabricantes";
import marcas from "../models/marcas";

import https from 'https';

export const httpClient = async function (options) {
  return new Promise((resolve, reject) => {
    const ret = https.request(options, ret =>{
      let rpta = {};
      let data = ""
      if (ret.statusCode !== 200) {
        const error = { from: `${options.host}${options.path}`, code: ret.statusCode, message: ret.statusMessage };
        console.log(error);
        ret.resume();
        reject(error)
      } else {
        ret.setEncoding('utf8');
        rpta['status'] = ret.statusCode;
        rpta['statusMessage'] = ret.statusMessage;
        //rpta['headers'] = ret.headers;
        rpta['from'] = `${options.host}${options.path}`
        ret.on('close', () => {
          const result = JSON.parse(data);
          //console.log(data)
          rpta['data'] = result;
          resolve(rpta)
        });
        ret.on('data', chunk => {
          data += chunk;
        });
      }
    });
    ret.end()
  });
}

class ImportDataControler {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/import/fulldata',
				this.fulldata );
  }

  async fulldata(req: Request, res: Response){
    const qry = '/articulos/fulldata/list'
    const options = {
      host: 'firulais.net.ar',
      path: `https://firulais.net.ar/api${qry}`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        //'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }
    try {
      const ret:any = await httpClient(options);
      //const repta = ret;
      const repta = [];
      const newData = [];
      //repta.push({next: 'http://fofware.com.ar:4444/make/articulo'})
      repta.push({next: 'http://fofware.com.ar:4444/make/tablas'});
      repta.push(ret);
      repta.push(newData);
      for (let i = 0; i < ret.data.length; i++) {
        const art = ret.data[i];
        if(`${art._id}` !== `623f49752129b838062ce76d`){
          const prodList = [];
          const prodData = [];
          for (let n = 0; n < art.productos.length; n++) {
            const pro = art.productos[n];
            prodList.push(pro);
            const pres = {
                _id: pro._id
              , ean: pro.codigo
              , plu: pro.plu
              , articulo: art._id
              , relacion: pro.parent
              , name: pro.name
              , contiene: pro.contiene
              , unidad: pro.unidad
              , image: pro.image
              , images: [pro.image]
              , tags: pro.tags
              , servicio: false
              , insumo: false
              , pesable: pro.pesable
              , pVenta: pro.pVenta
              , pCompra: pro.pCompra
              , iva: pro.iva
              , margen: pro.margen
              , oferta: pro.oferta
              , oferta_desde: pro.precio_desde
              , oferta_hasta: pro.precio_hasta
              , oferta_precio: pro.oferta ? pro.precio : null
              , precio: pro.calc_precio
              , compra: pro.showCompra
              , compra_fecha: null
              , reposicion: pro.reposicion
              , reposicion_fecha: null
              , stock: pro.stock
              , stockMin: pro.stockMin
              , stockMax: pro.stockMax
            }
            prodData.push(pres);
            const precios = {
              _id: pro._id
              , oferta: pro.oferta
              , oferta_desde: pro.oferta ? pro.precio_desde : null
              , oferta_hasta: pro.oferta ? pro.precio_hasta : null
              , oferta_precio: pro.oferta ? pro.showPrecio : null
              //
              , compra: pro.showCompra
              , compra_fecha: null
              //
              , reposicion: pro.reposicion
              , reposicion_fecha: null
            }
            const rpta = await presentacion.updateOne(
              { _id: pres._id },   // Query parameter
              { $set: pres }, 
              { upsert: true }    // Options
            );
            console.log("Productos Ok",n)
          }
          const newArt = {
             _id: art._id
            ,fabricante: art.fabricante
            ,marca: art.marca
            ,rubro: art.rubro
            ,linea: art.linea
            ,especie: art.especie
            ,edad: art.edad
            ,raza: art.raza
            ,name: art.name
            ,tags: art.tags
            //
            ,d_fabricante: art.d_fabricante
            ,d_marca: art.d_marca
            ,d_rubro: art.d_rubro
            ,d_linea: art.d_linea
            ,d_especie: art.d_especie
            ,d_edad: art.d_edad
            ,d_raza: art.d_raza
            //
            ,detalles: art.detalles
            ,formula: art.formula
            ,beneficios: art.beneficios
            ,presentaciones: prodList
            //
            ,private_web: art.private_web
            ,image: art.image
            ,images: [art.image]
            ,videos:[]
            ,url: art.url
            ,iva: art.iva
            ,margen: art.margen
          }
          newData.push(newArt);
          const rpta = await articulo.updateOne(
            { _id: newArt._id },   // Query parameter
            { $set: newArt }, 
            { upsert: true }    // Options
          );
          newArt['prodData'] = prodData;
          repta.push(rpta)
          console.log("Articulos Ok",i)
        }
      }
      res.status(200).json(repta);
    } catch (error) {
      console.log(error);
      //res.json(error);
    }

  }

}

export const importCtrl = new ImportDataControler();
