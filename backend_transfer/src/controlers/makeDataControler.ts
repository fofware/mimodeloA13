import { Request, Response, Router } from "express";
import _presentacion from "../models/_presentaciones";
import presentacion from "../models/master/presentaciones";
import _articulo from "../models/_articulos";
import articulos from "../models/master/articulos";
import _extradata from "../models/_extradata";
import extradata from "../models/master/extradata";
import prodName, {} from '../models/master/productoname';
import fabricantes, {} from "../models/master/fabricantes";
import marcas, {} from "../models/master/marcas";
import especies, {} from "../models/master/especies";
import rubros from "../models/master/rubros";
import lineas from "../models/master/lineas";
import razas from "../models/master/razas";
import edades from "../models/master/edades";
import precio from "../models/precio";
import costo from "../models/costo";
import _reposicion from "../models/_reposicion";
import productoname from "../models/master/productoname";
import presentaciones from "../models/master/presentaciones";
import proveedorProductos from "../models/proveedorProductos";
import reposicion from "../models/reposicion";
import medidas from "../models/master/medidas";
import tallas from "../models/master/tallas";

class MakeDataControler {

	public router: Router = Router();
  modelos = {
    'fabricante': fabricantes,
    'marca': marcas,
    'especie': especies
  }
  constructor() {
		this.config();
	}

  config () {
    this.router.get(
      '/make/tablas', 
      this.tablas
      );
    this.router.get(
      '/make/articulo', 
      this.articulo 
    );
    this.router.get(
      '/make/extradata',
      this.extradata 
    );
    this.router.get(
      '/make/presentacion',
      this.presentacion 
    );
    this.router.get(
      '/make/productoname',
      this.productoname 
    );
    this.router.get(
      '/make/costo',
      this.costo 
    );
    this.router.get(
      '/make/precio',
      this.precio 
    );
  }

  async articulo( req: Request, res: Response){
    const rpta = {};
    rpta['next'] = 'http://192.168.100.150:4444/make/extradata';

		try {
      const _art = await _articulo.find();
      rpta['src'] = _art;
      rpta['rslt'] = [];
      const ret = await articulos.insertMany(_art);
      rpta['rslt'].push(ret);
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
		}
	}

  async tablas(req: Request, res: Response){
    await articulos.deleteMany({});
    await _reposicion.deleteMany({});
    await reposicion.deleteMany({});
    await extradata.deleteMany({});
    await presentacion.deleteMany({});
    await productoname.deleteMany({});
    await fabricantes.deleteMany({});
    await marcas.deleteMany({});
    await rubros.deleteMany({});
    await lineas.deleteMany({});
    await razas.deleteMany({});
    await tallas.deleteMany({});
    await edades.deleteMany({});
    await especies.deleteMany({});
    await precio.deleteMany({});
    await presentaciones.deleteMany({});
    await proveedorProductos.deleteMany({});

    const varios = [
      {'field': 'especieTxt', 'value': 'gato', 'newValue': 'Gato' },
      //
      {'field': 'edadTxt', 'value': 'senior', 'newValue': 'Senior' },
      //
      {'field': 'razaTxt', 'value': 'Mini', 'newValue': 'Minis' },
      {'field': 'razaTxt', 'value': 'Minis Pequeñas', 'newValue': 'Minis,Pequeñas' },
      {'field': 'razaTxt', 'value': 'Pequeña', 'newValue': 'Pequeñas' },
      {'field': 'razaTxt', 'value': 'Medina y Grande', 'newValue': 'Medianas,Grandes' },
      {'field': 'razaTxt', 'value': 'Medianas Grandes', 'newValue': 'Medianas,Grandes' },
      //
      {'field': 'tags', 'value': 'semior', 'newValue': 'senior' },
      {'field': 'tags', 'value': 'urinario', 'newValue': 'urinario' },
      {'field': 'tags', 'value': 'sanitarias,benonita', 'newValue': 'sanitarias,benonita,aglutinante' },
      {'field': 'tags', 'value': 'senior', 'newValue': 'senior,adulto' },
      {'field': 'tags', 'value': 'senior,adulto', 'newValue': 'senior,adulto' },
      {'field': 'tags', 'value': 'sobrecito', 'newValue': 'sobrecitos' },
      {'field': 'tags', 'value': 'sobrecitos', 'newValue': 'sobrecitos' },
      {'field': 'tags', 'value': 'Urinario', 'newValue': 'urinario,urinary' },
      {'field': 'tags', 'value': 'urinary.urinario', 'newValue': 'urinario,urinary' },
      {'field': 'tags', 'value': 'medicados, dermatologico, piel sensible', 'newValue': 'medicados,dermatologico,piel sensible' },
      {'field': 'tags', 'value': 'sanitarias,benonita,aglutinante', 'newValue': 'sanitarias,benonita,aglutinante' },
      {'field': 'tags', 'value': 'medicados, gastrointestinal', 'newValue': 'medicados,gastrointestinal' },
    ]
    const rpta = [];
    for (let i = 0; i < varios.length; i++) {
      const par = varios[i];
      const filter = {}
      filter[par.field] = par.value;
      const newValue = {}
      newValue[par.field] = par.newValue
      rpta.push( await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // set values
        { upsert: false }     // Options
      ));
    }

    const next = 'http://192.168.100.150:4444/make/articulo';
    const test = 'fabricante';

    let rslt = [];
    const fabricante = [];
    let array = await _articulo.distinct( 'fabricanteTxt' );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await fabricantes.updateOne(
        { name: e.name },   // Query parameter
        { $set: e },        // Set Values
        { upsert: true }    // Options
      );
      console.log(data);
      data['name'] = array[i];
      fabricante.push(data);
    }
    array = await fabricantes.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['fabricanteTxt'] = e.name;
      console.log(e);
      const newValue = {
        'fabricante': e._id,
        'fabricanteTxt': e.name
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }


    const marca = [];    
    array = await _articulo.distinct( 'marcaTxt', );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await marcas.updateOne(
        { name: e.name },   // Query parameter
        { $set: e }, 
        { upsert: true }    // Options
      );
      data['name'] = array[i];
      console.log(data);
      marca.push(data);
    }
    array = await marcas.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['marcaTxt'] = e.name;
      console.log(e);
      const newValue = {
        'marca': e._id,
        'marcaTxt': e.name
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }

    array = await fabricantes.find();
    for (let i = 0; i < array.length; i++) {
      const fab = array[i];
      const _art = await _articulo.find({ fabricante: fab._id });
      const tmp_marca = [];
      for (let a = 0; a < _art.length; a++) {
        const e = _art[a];
        if(tmp_marca.findIndex((el) =>  `${el}` === `${e.marca}`) === -1) 
        {
          tmp_marca.push(e.marca);
        }
      }
      //await fabricantes.findByIdAndUpdate(fab._id, {marcas: tmp_marca});
      for (let i = 0; i < tmp_marca.length; i++) {
        const filter = {_id: tmp_marca[i] };
        const update = { fabricante: fab._id}
        let ret = await marcas.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true,
          rawResult: true // Return the raw result from the MongoDB driver
        });
      }
    }

    const especie = [];    
    array = await _articulo.distinct( 'especieTxt' );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await especies.updateOne(
        { name: e.name },   // Query parameter
        { $set: e },        // Set values
        { upsert: true }    // Options
      );
      data['name'] = array[i];
      console.log(data);
      especie.push(data);
    }
    array = await especies.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['especieTxt'] = e.name;
      console.log(e);
      const newValue = {
        'especie': e._id,
        'especieTxt': e.name
      }

      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }
    
    const rubro = [];
    array = await _articulo.distinct( 'rubroTxt' );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await rubros.updateOne(
        { name: e.name },   // Query parameter
        { $set: e },        // Set Values
        { upsert: true }    // Options
      );
      console.log(data);
      data['name'] = array[i];
      rubro.push(data);
    }
    array = await rubros.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['rubroTxt'] = e.name;
      console.log(e);
      const newValue = {
        'rubro': e._id,
        'rubroTxt': e.name
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }


    const linea = [];    
    array = await _articulo.distinct( 'lineaTxt', );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await lineas.updateOne(
        { name: e.name },   // Query parameter
        { $set: e }, 
        { upsert: true }    // Options
      );
      data['name'] = array[i];
      console.log(data);
      linea.push(data);
    }
    array = await lineas.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['lineaTxt'] = e.name;
      console.log(e);
      const newValue = {
        'linea': e._id,
        'lineaTxt': e.name
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }

    array = await rubros.find();
    for (let i = 0; i < array.length; i++) {
      const fab = array[i];
      const _art = await _articulo.find({ rubro: fab._id });
      const tmp_linea = [];
      for (let a = 0; a < _art.length; a++) {
        const e = _art[a];
        if(tmp_linea.findIndex((el) =>  `${el}` === `${e.linea}`) === -1) 
        {
          tmp_linea.push(e.linea);
        }
      }
      //await fabricantes.findByIdAndUpdate(fab._id, {marcas: tmp_marca});
      for (let i = 0; i < tmp_linea.length; i++) {
        const filter = {_id: tmp_linea[i] };
        const update = { rubro: fab._id}
        let ret = await lineas.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true,
          rawResult: true // Return the raw result from the MongoDB driver
        });
      }
    }



		//const rubro = await articulo.distinct('rubro');

    //const linea = await articulo.distinct('linea');

    const raza = [];    
    array = await _articulo.distinct( 'razaTxt' );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await tallas.updateOne(
        { name: e.name },   // Query parameter
        { $set: e },        // Set values
        { upsert: true }    // Options
      );
      data['name'] = array[i];
      console.log(data);
      //especie.push(data);
    }
    array = await tallas.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['razaTxt'] = e.name;
      console.log(e);
      const newValue = {
        'raza': e._id,
        'talla': e._id,
        'razaTxt': e.name
      }

      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }
  
    await medidas.insertMany(array); 

    const edad = [];    
    array = await _articulo.distinct( 'edadTxt' );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await edades.updateOne(
        { name: e.name },   // Query parameter
        { $set: e },        // Set values
        { upsert: true }    // Options
      );
      data['name'] = array[i];
      console.log(data);
      especie.push(data);
    }
    array = await edades.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['edadTxt'] = e.name;
      console.log(e);
      const newValue = {
        'edad': e._id,
        'edadTxt': e.name
      }

      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }
    const sanitize = await _articulo.find();
    for (let i = 0; i < sanitize.length; i++) {
      const a:any = sanitize[i];
      a['sText'] = [];
      if(a.fabricanteTxt && a.fabricanteTxt !== '') a['sText'].push(a.fabricanteTxt);
      if(a.marcaTxt && a.marcaTxt !== '') a['sText'].push(a.marcaTxt);
      if(a.rubroTxt && a.rubroTxt !== '') a['sText'].push(a.rubroTxt);
      if(a.lineaTxt && a.lineaTxt !== '') a['sText'].push(a.lineaTxt);
      if(a.especieTxt && a.especieTxt !== '') a['sText'].push(a.especieTxt);
      if(a.razaTxt && a.razaTxt !== '') a['sText'].push(a.razaTxt);
      if(a.edadTxt && a.edadTxt !== '') a['sText'].push(a.edadTxt);
      await _articulo.updateOne({_id: a._id}, a);
    }
		const name = await _articulo.distinct('name');
		const tags = await _articulo.distinct('tags');
		//res.status(200).json({next,fabricante,marca,rubro,linea,especie,raza,edad,name,tags});
		res.status(200).json({next});
  }


  async extradata(req: Request, res: Response){
    const rpta = {};
    rpta['next'] = 'http://192.168.100.150:4444/make/presentacion';

    try {
      const _art = await _extradata.find();
      rpta['src'] = _art;
      rpta['rslt'] = [];
      const ret = await extradata.insertMany(_art);
      rpta['rslt'].push(ret);
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
		}
    
  }

  async presentacion(req: Request, res: Response){
    const rpta = {};
    rpta['next'] = 'http://192.168.100.150:4444/make/costo';

    try {
      const _art = await _presentacion.find();
      rpta['src'] = _art;
      rpta['rslt'] = [];
      const ret = await presentacion.insertMany(_art);
      rpta['rslt'].push(ret);
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
		}
  }

  async productoname(req: Request, res: Response){
    const array = await presentacion.find()
      .populate({path: 'articulo', populate: { path: 'fabricante marca rubro linea especie edad talla'} })
      .populate({path: 'relacion'});
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      const e:any = array[i];
      //let tags = (e.articulo.tags ? e.articulo.tags : '');
      //if(e.tags){
      //  if(tags.length) tags = (`${tags},${e.tags}`).trim();
      //  else tags = e.tags;
      //}
      const names = [
        'fabricante',
        'marca',
        'especie',
        'talla',
        'edad',
        'rubro',
        'linea'
      ]
      let sText = [];
      for (let i = 0; i < names.length; i++) {
        if(e.articulo[names[i]].name !== '') sText.push(e.articulo[names[i]].name);
      }

      const reg = {
        _id: e._id,
        articulo: e.articulo,
        ean: e.ean,
        //fabricanteTxt: e.articulo.fabricanteTxt,
        fabricante: e.articulo.fabricante,
        //marcaTxt: e.articulo.marcaTxt,
        marca: e.articulo.marca,
        //especieTxt: e.articulo.especieTxt,
        especie: e.articulo.especie,
        //razaTxt: e.articulo.razaTxt,
        talla: e.articulo.talla,
        //edadTxt: e.articulo.edadTxt,
        edad: e.articulo.edad,
        //rubroTxt: e.articulo.rubroTxt,
        rubro: e.articulo.rubro,
        //lineaTxt: e.articulo.lineaTxt,
        linea: e.articulo.linea,
        tags: e.articulo.tags,
        sText, 
        image: e.image ? e.image : e.articulo.image,
        artName: e.articulo.fullname, 
        prodName: e.relacion?.fullname ? `${e.name} de ${e.contiene} ${e.relacion.fullname}` : `${e.name} ${e.contiene} ${e.unidad}`,
        //fullname: e.fullname,
        pesable: e.pesable,
        pCompra: e.pCompra,
        pVenta: e.pVenta,
        //precio: e.precio,
        //oferta: e.oferta,
        //oferta_precio: e.oferta_precio,
        //oferta_desde: e.oferta_desde,
        //oferta_hasta: e.oferta_hasta,
        //stock: e.stock,
        //unidad: e.unidad,
        //name: e.name,
        //contiene: e.contiene,
      }
      ret.push(reg);
      const rpta = await prodName.updateOne( 
          { _id: reg._id },   // Query parameter
          { $set: reg }, 
          { upsert: true }    // Options
      );
      console.log(reg._id);
    }
    res.status(200).json({ret});
  }

  async costo(req: Request, res: Response){
    const rpta = {};
    rpta['next'] = 'http://192.168.100.150:4444/make/precio';
    try {
      const _art = await _presentacion.find();
      rpta['src'] = _art;
      rpta['rslt'] = [];
      const ret = await _reposicion.insertMany(_art);
      rpta['rslt'].push(ret);
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
		}
  }
  async precio(req: Request, res: Response){
    const rpta = {};
    rpta['next'] = 'http://192.168.100.150:4444/make/productoname';
    try {
      const _art = await _presentacion.find();
      rpta['src'] = _art;
      rpta['rslt'] = [];
      const ret = await precio.insertMany(_art);
      rpta['rslt'].push(ret);
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
		}
  }
}

export const makeCtrl = new MakeDataControler();
