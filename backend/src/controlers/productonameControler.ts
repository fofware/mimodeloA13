import { Request, Response, Router } from "express";
import prodName, { IProductoName } from "../models/productoname";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from "passport";
import { makeFilter } from "../common/utils";

class ProductoNameControler {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/api/productoname',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/api/productoname/:id',
        //passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/api/productoname',
        passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/api/productoname/:id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/api/productoname/:id',
        passport.authenticate('jwt', {session:false}),
        this.put );
  }
  async list(req: Request, res: Response){
    const fldsString = [
      'fullName',
      'fabricante',
      'marca',
      'rubro',
      'linea',
      'especie',
      'edad',
      'raza',
      'unidad',
      'ean',
      'tags'
    ];
  

    const params = Object.assign({
      url: req.headers.host+req.url,
      limit: 50,
      offset: 0,
      iniT: new Date().getTime(),
      searchItem: ''
    },req.query,req.params,req.body);
    console.log('list',params,fldsString)
    const filter = makeFilter(fldsString, params);
    console.log(filter);
    res.status(200).json(filter);
  }
  async get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    console.log('get',params)
  }
  async add(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    console.log('add',params)
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