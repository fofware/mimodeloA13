import { Request, Response, Router } from "express";
import prodName, { IProductoName } from "../models/productoname";
import presentaciones, { IPresentacion } from '../models/presentaciones'
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from "passport";
import { makeAggregate, makeFilter } from "../common/utils";
import { ObjectID } from 'bson'

class PresentacionesControlers {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/presentaciones',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/presentaciones/:id',
        //passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/presentaciones',
        //passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/presentaciones/:id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/presentaciones/:id',
        passport.authenticate('jwt', {session:false}),
        this.put );
    this.router.get('/presentaciones/articulo/:articulo', this.articulo)
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
      'art_name'
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
    const count = await presentaciones.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    
    const data = await presentaciones.find(filter).limit(params.limit).skip(params.offset).sort(params.sort).populate({path:'articulo'});
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
    const prod = await presentaciones.find({_id: params.id})
    console.log('get',params)
    res.status(200).json(prod)
  }

  async add(req: Request, res: Response){
    try {
      const update = Object.assign({},req.query,req.params,req.body);
      const filter = { 
        _id: update._id
      };
      let ret = await presentaciones.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });
      ret.value instanceof presentaciones; // true
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
  async articulo(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    let ret = {};
    let status = 200
    try {
      const rows = await presentaciones.find({articulo: new ObjectID(params.articulo)})
        .populate({path: 'relacion'})
        .sort({name: 1, contiene: 1, 'relacion.contiene': 1 });
      /*
      const rows = await presentaciones.aggregate([
        {
          $match: {
            articulo: new ObjectID(params.articulo),
          }
        },
        {
					$graphLookup: {
						 from: "presentacions",
						 startWith: "_id",
						 connectFromField: "relacion",
						 connectToField: "_id",
						 as: "presentaciones"
					}
			 	},
      ])
      */
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);      
    }
  }
}

export const presentacionCtrl = new PresentacionesControlers();