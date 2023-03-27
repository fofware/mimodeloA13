import { Request, Response, Router } from "express";
import passport from "passport";
import { makeFilter } from "../common/utils";

import fabricante from "../models/fabricantes";
import marca from "../models/marcas";
import modelo from '../models/modelo';
import especie from '../models/especies';
import edad from '../models/edades';
import talla from '../models/tallas';
import rubro from '../models/rubros';
import linea from '../models/lineas';
import unidad from '../models/unidades';

export const mfiles = {
  fabricante: fabricante,
  marca: marca,
  modelo: modelo,
  especie: especie,
  edad: edad,
  talla: talla,
  rubro: rubro,
  linea: linea,
  unidad: unidad
}

class mAbmControlers {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/mabm/:file',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/mabm/:file/:_id',
        passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/mabm/:file',
        passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/mabm/:file/:_id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/mabm/:file/:_id',
        passport.authenticate('jwt', {session:false}),
        this.put );
  }

  async list(req: Request, res: Response){
    const fldsString = [
      'name'
    ];
    
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { name: 1 },
      searchItem: ''
    },req.query,req.params,req.body);
    //console.log(mfiles);
    let status = 0;
    let ret = {}
    try {
      console.log()
      const filter = makeFilter(fldsString, params);
      const count = await mfiles[params.file].count(filter);
      
      params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
      params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;
  
      let nextOffset = params.offset+params.limit;
      nextOffset = nextOffset > count ? false : params.offset+params.limit;
      const rows = await mfiles[params.file].find(filter).limit(params.limit).skip(params.offset).sort(params.sort);
      status = 200;
      ret = {
        url: req.headers.host+req.url,
        limit: params.limit,
        offset: params.offset,
        nextOffset,
        sort: params.sort,
        count,
        apiTime: new Date().getTime() - params.iniTime,
        filter,
        rows,
        toast: { type: 'info', header:'Lista Fabricantes', message: `Se listaron ${rows.length} de ${count}`},
        message: `Se listaron ${rows.length} de ${count}`
      }

    } catch (error) {
      console.log(error);
      ret['params'] = params,
      status = 400;
      ret['toast'] = { header:'Algo anduvo mal', message: 'No se pudo obetenr la lista'};
      ret['error'] = error;
    }
    res.status(status).json(ret);
  }

  async get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    let ret = {};
    let status = 200;
    try {
      console.log(params);
      ret = await mfiles[params.file].findById( params._id );
      console.log(ret);
    } catch (error) {
      console.log(error);
      ret['params'] = params,
      status = 400;
      ret['toast'] = { header:'Algo anduvo mal', message: 'No se pudo obetenr el registro'};
      ret['error'] = error;

    }
    res.status(status).json(ret)
  }

  async add(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    console.log('-------------');
    console.log(params);
    console.log('-------------');
    const filter = { 
      name: params.name,
    };
    try {
      let ret = await mfiles[params.file].findOneAndUpdate(filter, params.data, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });

      ret.value instanceof mfiles[params.file]; // true
      // The below property will be `false` if MongoDB upserted a new
      // document, and `true` if MongoDB updated an existing object.
      ret.lastErrorObject.updatedExisting; // false
      return res.status(200).json(ret);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  async delete(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    let ret = {
      params,
    };
    let status = 0;
    try {
      ret['data'] = await mfiles[params.file].findByIdAndDelete(params._id);
      ret['message'] = `Registro ${params._id} Borrado Ok`
      status = 200;
    } catch (error) {
      ret['toast'] = { type: '', header:'Algo anduvo mal', message: 'No se pudo borrar el registro'};
      ret['message'] = `algo andubo mal`
      ret['error'] = error;
      status = 400;
    }
    console.log(ret)
    res.status(status).json(ret);
  }

  async put(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    let status = 0;
    let ret = {};
    try {
      ret['data'] = await mfiles[params.file].findByIdAndUpdate(params._id, params);
      ret['message'] = `Update Ok`
      status = 200;
    } catch (error) {
      status = 400;
      ret['message'] = 'Algo anduvo mal';
      ret['error'] = error;
    }
    res.status(status).json(ret);
  }
}

export const mAbmCtrl = new mAbmControlers();