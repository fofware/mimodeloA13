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
  }
  async list(req: Request, res: Response){
    const fldsString = [
      //'fullName',
      'fabricante',
      'marca',
      'rubro',
      'linea',
      'especie',
      'edad',
      'raza',
      'unidad',
      'ean',
      'tags',
      'art_name',
      'prodName'
    ];
  
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { fullName: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    console.log('list',params,fldsString)
    const filter = makeFilter(fldsString, params);
    //const filter = makeAggregate(fldsString, params);
    //console.log(filter);
    //console.log(filter['$or'][0]);
    const count = await prodName.count(filter);
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;
    
    const data = await prodName.find(filter).limit(params.limit).skip(params.offset).sort(params.sort);
    const ret = {
      url: req.headers.host+req.url,
      limit: params.limit,
      offset: params.offset,
      sort: params.sort,
      count,
      searchTime: new Date().getTime() - params.iniTime,
      filter,
      data,
    }
    res.status(200).json(ret);
  }
  async get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    console.log('get',params)
  }
  async add(req: Request, res: Response){
    try {
      const update = Object.assign({},req.query,req.params,req.body);
      //console.log('add',params)
      console.log(update);
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
      //console.log('precios',ret);
      return res.status(200).json(ret);
    
    } catch (error) {
      console.log(error)      
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