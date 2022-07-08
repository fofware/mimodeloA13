import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from "passport";
import { makeFilter } from "../common/utils";
import ProveedorProducto from "../models/proveedorProductos"
import presentaciones from "../models/presentaciones";
class ProveedorProductoControlers {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/proveedor/:proveedor/productos',
				passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/proveedror/:proveedor/producto/:id',
        //passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/proveedor/producto',
        passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/proveedor/producto/:id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/proveedor/:proveedor/producto/:id',
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
      sort: {},
      searchItem: ''
    },req.query,req.params,req.body);

    console.log('list',params,fldsString)
    const filter = makeFilter(fldsString, params);
    if(params.proveedor && params.proveedor !== 'undefined') filter['proveedor'] = params.proveedor;
    if(params.fabricante && params.fabricante !== 'undefined') filter['fabricante'] = params.fabricante;
    if(params.marca && params.marca !== 'undefined') filter['marca'] = params.marca;
    if(params.articulo && params.articulo !== 'undefined') filter['articulo'] = params.articulo;
    if(params.presentacion && params.presentacion !== 'undefined') filter['presentacion'] = params.presentacion;
    
    console.log(filter);
    
    const count = await ProveedorProducto.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    
    const data = await ProveedorProducto
          .find(filter)
          .limit(params.limit)
          .skip(params.offset)
          .populate({path:'v_prodname', select: 'fullname -_id'})
          .sort(params.sort);
    //.populate({path:'articulo'}).populate({path: 'presentacion', populate: {path: 'relacion'}}).sort(params.sort);
    const ret = {
      url: req.headers.host+req.url,
      limit: params.limit,
      offset: params.offset,
      nextOffset,
      sort: params.sort,
      count,
      apiTime: new Date().getTime() - params.iniTime,
      filter,
      data,
    }
    res.status(200).json(ret);
  }
  async get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    const prod = await ProveedorProducto.find({_id: params.id})
    console.log('get',params)
    res.status(200).json(prod)
  }

  async add(req: Request, res: Response){
    try {
      const update = Object.assign({},req.query,req.params,req.body);
      const filter = { 
        proveedor: update.proveedor,
        presentacion: update.presentacion
      };
      let ret = await ProveedorProducto.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });
      ret.value instanceof ProveedorProducto; // true
      // The below property will be `false` if MongoDB upserted a new
      // document, and `true` if MongoDB updated an existing object.
      ret.lastErrorObject.updatedExisting; // false
      return res.status(200).json(ret);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    try {
      const ret = await ProveedorProducto.findByIdAndDelete(params.id);
      console.log("delete",params)

      return res.status(200).json(ret);
    } catch (error) {
      res.status(400).json({
        message: 'Borrando producto de proveedor',
        title: 'Algo Anduvo Mal',
        error,
      })      
    }
  }
  async put(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
  }

}

export const proveedorProductoCtrl = new ProveedorProductoControlers();