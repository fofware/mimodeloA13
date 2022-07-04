import { Request, Response, Router } from "express";
import _presentacion from "../models/_presentaciones";
import presentacion from "../models/presentaciones";
import _articulo from "../models/_articulos";
import articulos from "../models/articulos";
import prodName, {} from '../models/productoname';
import fabricantes, {} from "../models/fabricantes";
import marcas, {} from "../models/marcas";
import especies, {} from "../models/especies";
import rubros from "../models/rubros";
import lineas from "../models/lineas";

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
    this.router.get('/make/tablas', this.tablas)
    this.router.get('/make/articulo', this.articulo );
    this.router.get('/make/presentacion',
        this.presentacion );
    this.router.get('/make/productoname',
        this.productoname );
    this.router.get('/make/precio',
        this.precio );
  }

  async articulo( req: Request, res: Response){
    const rpta = {};
    rpta['next'] = 'http://fofware.com.ar:4444/make/presentacion';

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
    const varios = [
      {'field': 'especie', 'value': 'gato', 'newValue': 'Gato' },
      //
      {'field': 'edad', 'value': 'senior', 'newValue': 'Senior' },
      //
      {'field': 'raza', 'value': 'Mini', 'newValue': 'Minis' },
      {'field': 'raza', 'value': 'Minis Pequeñas', 'newValue': 'Minis,Pequeñas' },
      {'field': 'raza', 'value': 'Pequeña', 'newValue': 'Pequeñas' },
      {'field': 'raza', 'value': 'Medina y Grande', 'newValue': 'Medianas,Grandes' },
      {'field': 'raza', 'value': 'Medianas Grandes', 'newValue': 'Medianas,Grandes' },
      //
      {'field': 'tags', 'value': 'semior', 'newValue': 'eenior' },
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

    const next = 'http://fofware.com.ar:4444/make/articulo';
    const test = 'fabricante';

    let rslt = [];
    const fabricante = [];
    let array = await _articulo.distinct( 'fabricante' );
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
      filter['fabricante'] = e.name;
      console.log(e);
      const newValue = {
        'fabricante_id': e._id
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }


    const marca = [];    
    array = await _articulo.distinct( 'marca', );
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
      filter['marca'] = e.name;
      console.log(e);
      const newValue = {
        'marca_id': e._id
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
      const _art = await _articulo.find({ fabricante_id: fab._id });
      const tmp_marca = [];
      for (let a = 0; a < _art.length; a++) {
        const e = _art[a];
        if(tmp_marca.findIndex((el) =>  `${el}` === `${e.marca_id}`) === -1) 
        {
          tmp_marca.push(e.marca_id);
        }
      }
      await fabricantes.findByIdAndUpdate(fab._id, {marcas: tmp_marca});
      for (let i = 0; i < tmp_marca.length; i++) {
        const filter = {_id: tmp_marca[i] };
        const update = { fabricante: fab.name, fabricante_id: fab._id}
        let ret = await marcas.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true,
          rawResult: true // Return the raw result from the MongoDB driver
        });
      }
    }

    const especie = [];    
    array = await _articulo.distinct( 'especie' );
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
      filter['especie'] = e.name;
      console.log(e);
      const newValue = {
        'especie_id': e._id
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }
    
    //const fabricante = await this.saveTablas('fabricante',fabricantes);
    //const fabricante = rslt;
    //const marca = await this.saveTablas('marca',marcas);
    //const especie = await this.saveTablas('especie',especies);

    const rubro = [];    
    array = await _articulo.distinct( 'rubro' );
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      const e = {
        name: array[i]
      }
      const data = await rubros.updateOne(
        { name: e.name },   // Query parameter
        { $set: e },        // set value
        { upsert: true }    // Options
      );
      console.log(data);
      especie.push(data);
    }
    array = await rubros.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['rubro'] = e.name;
      console.log(e);
      const newValue = {
        'rubro_id': e._id
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }

		//const rubro = await articulo.distinct('rubro');

    const linea = [];    
    array = await _articulo.distinct( 'linea' );
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
      console.log(data);
      especie.push(data);
    }
    array = await lineas.find();
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      const filter = {}
      filter['linea'] = e.name;
      console.log(e);
      const newValue = {
        'linea_id': e._id
      }
      const retd = await _articulo.updateMany(
        filter,               // Query parameter
        { $set: newValue },   // Set values
        { upsert: false }     // Options
      );
      console.log(retd);
    }
    //const linea = await articulo.distinct('linea');

		const raza = await _articulo.distinct('raza');
		const edad = await _articulo.distinct('edad');
		const name = await _articulo.distinct('name');
		const tags = await _articulo.distinct('tags');
		res.status(200).json({next,fabricante,marca,rubro,linea,especie,raza,edad,name,tags});
  }


  async presentacion(req: Request, res: Response){
    const rpta = {};
    rpta['next'] = 'http://fofware.com.ar:4444/make/productoname';

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
    const array = await presentacion.find().populate({path: 'relacion'}).populate({path: 'articulo'});
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      const e:any = array[i];
      let tags = (e.articulo.tags ? e.articulo.tags : '');
      if(e.tags){
        if(tags.length) tags = (`${tags},${e.tags}`).trim();
        else tags = e.tags;
      }
      const reg =         {
        _id: e._id,
        articulo: e.articulo,
        ean: e.ean,
        plu: e.plu,
        fabricante: e.articulo.fabricante,
        fabricante_id: e.articulo.fabricante_id,
        marca: e.articulo.marca,
        marca_id: e.articulo.marca_id,
        especie: e.articulo.especie,
        especie_id: e.articulo.especie_id,
        raza: e.articulo.raza,
        edad: e.articulo.edad,
        rubro: e.articulo.rubro,
        rubro_id: e.articulo.rubro_id,
        linea: e.articulo.linea,
        linea_id: e.articulo.linea_id,
        tags,
        image: e.image ? e.image : e.articulo.image,
        art_name: e.articulo.fullname,
        fullname: e.fullname,
        pesable: e.pesable,
        pCompra: e.pCompra,
        pVenta: e.pVenta,
        precio: e.precio,
        oferta: e.oferta,
        oferta_precio: e.oferta_precio,
        oferta_desde: e.oferta_desde,
        oferta_hasta: e.oferta_hasta,
        stock: e.stock,
        unidad: e.unidad,
        name: e.name,
        contiene: e.contiene,
        prodName: `${e.name} ${e.contiene} ${e.unidad}`
      }
      ret.push(reg);
      const rpta = await prodName.updateOne(
          { _id: reg._id },   // Query parameter
          { $set: reg }, 
          { upsert: true }    // Options
      );
      console.log(reg._id);
    }
    res.status(200).json({ret,array});
  }

  async precio(req: Request, res: Response){
    res.status(200).json('precio');
  }
}

export const makeCtrl = new MakeDataControler();
