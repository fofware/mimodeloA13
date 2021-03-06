import { Request, Response, Router } from "express";
import passport from "passport";
import { makeFilter } from "../common/utils";
import marcas from "../models/marcas";

class MarcaControlers {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/lineas',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    //this.router.get('/lineas/tah',
		//		//passport.authenticate('jwt', {session:false}), 
		//		this.listtah );
    this.router.get('/linea/:id',
        //passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/linea',
        passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/linea/:id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/linea/:id',
        passport.authenticate('jwt', {session:false}),
        this.put );
  }

  async list(req: Request, res: Response){
    const fldsString = [
      'name',
    //  'fabricante'
    ];
  
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { name: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
    const count = await marcas.count(filter);
    if(params.rubro && params.ruro !== 'undefined')
      filter['rubro'] = params.rubro;   
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    let status = 0;
    let ret = {}
    try {
      const data = await marcas.find(filter).limit(params.limit).skip(params.offset).sort(params.sort);
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
        data,
        message: 'Ok'
      }
        
    } catch (error) {
      console.log(error);
      status = 400;
      ret['message'] = 'Algo anduvo mal';
      ret['error'] = error;
    }
    res.status(status).json(ret);
  }

  //async listtah(req: Request, res: Response){
  //  const fldsString = [
  //    'name'
  //  ];
  //
  //  const params = Object.assign({
  //    limit: 50,
  //    offset: 0,
  //    iniTime: new Date().getTime(),
  //    sort: { name: 1 },
  //    searchItem: ''
  //  },req.query,req.params,req.body);
//
  //  const filter = makeFilter(fldsString, params);
  //  const count = await marcas.count(filter);
  //  if(params.fabricante_id && params.fabricante_id !== 'undefined')
  //    filter['fabricante_id'] = params.fabricante_id;
  //  
  //  params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
  //  params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;
//
  //  let nextOffset = params.offset+params.limit;
  //  nextOffset = nextOffset > count ? false : params.offset+params.limit;
  //  
  //  let status = 0;
  //  let ret = {}
  //  try {
  //    const data = await marcas.find(filter).limit(params.limit).skip(params.offset).sort(params.sort);
  //    status = 200;
  //    ret = {
  //      url: req.headers.host+req.url,
  //      limit: params.limit,
  //      offset: params.offset,
  //      nextOffset,
  //      sort: params.sort,
  //      count,
  //      apiTime: new Date().getTime() - params.iniTime,
  //      filter,
  //      data,
  //      message: 'Ok'
  //    }
  //      
  //  } catch (error) {
  //    console.log(error);
  //    status = 400;
  //    ret['message'] = 'Algo anduvo mal';
  //    ret['error'] = error;
  //  }
  //  res.status(status).json(ret);
  //}

  async get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    const ret = await marcas.findById( params.id );
    res.status(200).json(ret)
  }

  async add(req: Request, res: Response){
    const update = Object.assign({},req.query,req.params,req.body);
    const filter = { 
      name: update.marca,
    };
    try {
      let ret = await marcas.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });

      ret.value instanceof marcas; // true
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
    let ret = {
      params,
    };
    let status = 0;
    try {
      ret['data'] = await marcas.findByIdAndDelete(params._id);
      ret['message'] = `Registro Borrado Ok ${params._id}`
      status = 200;
    } catch (error) {
      ret['message'] = `algo andubo mal`
      ret['error'] = error;
      status = error.number;
    }
    console.log(ret)
    res.status(status).json(ret);
  }

  async put(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    let status = 0;
    let ret = {};
    try {
      ret['data'] = await marcas.findByIdAndUpdate(params._id, params);
      ret['message'] = `Update Ok`
      status = 200;
    } catch (error) {
      status = error.number;
      ret['message'] = 'Algo anduvo mal';
      ret['error'] = error;
    }
    res.status(status).json(ret);
  }

}

export const MarcaCtrl = new MarcaControlers();