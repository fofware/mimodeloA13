import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from "passport";
import { makeFilter } from "../common/utils";
import Proveedor from "../models/proveedores"
class ProveedorControlers {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/proveedores',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/proveedror/:id',
        //passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/proveedro',
        //passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/proveedro/:id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/proveedor/:id',
        passport.authenticate('jwt', {session:false}),
        this.put );
  }
  async list(req: Request, res: Response){
    const fldsString = [
      'name',
    ];
  
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { fullname: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    console.log('list',params,fldsString)
    const filter = makeFilter(fldsString, params);
    const count = await Proveedor.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    
    const data = await Proveedor.find(filter).limit(params.limit).skip(params.offset).sort(params.sort).populate({path:'articulo'});
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
    const prod = await Proveedor.find({_id: params.id})
    console.log('get',params)
    res.status(200).json(prod)
  }

  async add(req: Request, res: Response){
    try {
      const update = Object.assign({},req.query,req.params,req.body);
      const filter = { 
        _id: update._id
      };
      let ret = await Proveedor.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });
      ret.value instanceof Proveedor; // true
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

export const proveedorCtrl = new ProveedorControlers();