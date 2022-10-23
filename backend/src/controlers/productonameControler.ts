import { Request, Response, Router } from "express";
import prodName, { IProductoName } from "../models/productoname";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from "passport";
import { makeAggregate, makeFilter } from "../common/utils";
import { ObjectID } from 'bson'

class ProductoNameControler {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/productoname',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/productoname/:id',
        //passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/productoname',
        //passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/productoname/:id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/productoname/:id',
        passport.authenticate('jwt', {session:false}),
        this.put );
 		this.router.post( '/productoname/public', this.public );

  }
  async list(req: Request, res: Response){
    const fldsString = [
      //'fullname',
      'artName',
      'prodName',
      'sText',
      //'fabricante',
      //'marca',
      //'rubro',
      //'linea',
      //'especie',
      //'edad',
      //'raza',
      //'unidad',
      //'ean',
      //'tags',
      //'art_name',
      //'prodName'
    ];
    
    const fldsBoolean = [
      'pCompra',
      'pVenta'
    ]

    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { artName: 1, prodName: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
    if( params.fabricante && params.fabricante !== 'undefined' ){
      filter['fabricante'] = params.fabricante;
    }
    if( params.marca && params.marca !== 'undefined' ){
      filter['marca'] = params.marca;
    }
    if( params.articulo && params.articulo !== 'undefined' ){
      filter['articulo'] = params.articulo;
    }
    if(params.pesable){
      filter['pesable'] = params.pesable === 'false' ? { $ne: true } : true;
    }
    if(params.pVenta){
      filter['pVenta'] = params.pVenta === 'false' ? { $ne: true } : true;
    }
    if(params.pCompra){
      filter['pCompra'] = params.pCompra === 'false' ? { $ne: true } : true;
    }

    const count = await prodName.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    
    const rows = await prodName.find(filter)
      //.populate('relacion')
      .limit(params.limit)
      .skip(params.offset)
      .sort(params.sort);
    const ret = {
      url: req.headers.host+req.url,
      limit: params.limit,
      offset: params.offset,
      nextOffset,
      sort: params.sort,
      count,
      apiTime: new Date().getTime() - params.iniTime,
      filter,
      rows,
    }
    res.status(200).json(ret);
  }

  async public(req: Request, res: Response){
    const fldsString = [
      //'fullname',
      'artName',
      'prodName',
      'sText',
      //'fabricante',
      //'marca',
      //'rubro',
      //'linea',
      //'especie',
      //'edad',
      //'raza',
      //'unidad',
      //'ean',
      //'tags',
      //'art_name',
      //'prodName'
    ];
    
    const fldsBoolean = [
      'pCompra',
      'pVenta'
    ]

    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { artName: 1, prodName: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
    if( params.fabricante && params.fabricante !== 'undefined' ){
      filter['fabricante'] = params.fabricante;
    }
    if( params.marca && params.marca !== 'undefined' ){
      filter['marca'] = params.marca;
    }
    if( params.articulo && params.articulo !== 'undefined' ){
      filter['articulo'] = params.articulo;
    }
    if(params.pesable){
      filter['pesable'] = params.pesable === 'false' ? { $ne: true } : true;
    }
    if(params.pVenta){
      filter['pVenta'] = params.pVenta === 'false' ? { $ne: true } : true;
    }
    if(params.pCompra){
      filter['pCompra'] = params.pCompra === 'false' ? { $ne: true } : true;
    }

    const count = await prodName.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    
    const rows = await prodName.find(filter).limit(params.limit).skip(params.offset).sort(params.sort);
    const ret = {
      url: req.headers.host+req.url,
      limit: params.limit,
      offset: params.offset,
      nextOffset,
      sort: params.sort,
      count,
      apiTime: new Date().getTime() - params.iniTime,
      filter,
      rows,
    }
    res.status(200).json(ret);
  }

  async get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    const prod = await prodName.find({_id: params.id})
    console.log('get',params)
    res.status(200).json(prod)
  }

  async add(req: Request, res: Response){
    try {
      const update = Object.assign({},req.query,req.params,req.body);
      const filter = { 
        _id: update._id
      };
      let ret = await prodName.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });
      ret.value instanceof prodName; // true
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
    console.log("delete",params)
  }
  async put(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
  }

}

export const prodNameCtrl = new ProductoNameControler();