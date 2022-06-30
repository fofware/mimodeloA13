import { Request, Response, Router } from "express";
import passport from "passport";
import { makeFilter } from "../common/utils";
import marcas from "../models/marcas";
import ProveedorMarca from "../models/proveedorMarcas"
class ProveedorMarcaControlers {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/proveedor/:proveedor/marcas',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/proveedor/:proveedor/marcas/rel',
				passport.authenticate('jwt', {session:false}), 
				this.listRel );
    this.router.get('/proveedror/:proveedor/producto/:id',
        //passport.authenticate('jwt', {session:false}), 
        this.get );
    this.router.post('/proveedor/:proveedor',
        //passport.authenticate('jwt', {session:false}),
        this.add );
    this.router.delete('/proveedor/:proveedor/producto/:id',
        passport.authenticate('jwt', {session:false}), 
        this.delete );
    this.router.put('/proveedor/:proveedor/producto/:id',
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
      sort: { name: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
    const count = await ProveedorMarca.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    
    const data = await ProveedorMarca.find(filter).limit(params.limit).skip(params.offset).sort(params.sort).populate({path:'articulo'});
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
  async listRel(req: Request, res: Response){
    //const fldsString = [
    //  'name',
    //];
  //
    const params = Object.assign({
      iniTime: new Date().getTime(),
    },req.query,req.params,req.body);
//
    //const filter = makeFilter(fldsString, params);
    //const count = await ProveedorMarca.count(filter);
    //
    //params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    //params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;
//
    //let nextOffset = params.offset+params.limit;
    //nextOffset = nextOffset > count ? false : params.offset+params.limit;
    
    const provmarca = await ProveedorMarca.find({proveedor: params.proveedorId}).sort(params.sort);
    const notIn = provmarca.map(reg => reg.marca);
    const marcaFree = await marcas.find({_id: {$nin: notIn}})
    const ret = {
      url: req.headers.host+req.url,
      provmarca,
      marcaFree,
      apiTime: new Date().getTime() - params.iniTime,
    }
    res.status(200).json(ret);
  }
  async get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    const prod = await ProveedorMarca.find({_id: params.id})
    console.log('get',params)
    res.status(200).json(prod)
  }

  async add(req: Request, res: Response){
    try {
      const update = Object.assign({},req.query,req.params,req.body);
      const filter = { 
        marca: update.marca,
        proveedor: update.proveedor,
      };
      let ret = await ProveedorMarca.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });
      ret.value instanceof ProveedorMarca; // true
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

export const ProveedorMarcaCtrl = new ProveedorMarcaControlers();