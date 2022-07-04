import { Request, Response, Router, urlencoded } from 'express';
import { ObjectID } from 'bson'
import passport from "passport";
import articulo, { IArticulo } from '../models/articulos';
import { makeFilter } from '../common/utils';

class ArticuloControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
		this.router.get( '/articulos', this.list );
		this.router.get( '/articulos/lista', this.lista );
		this.router.get( '/articulos/full/lista', this.flista );
	}

	async list( req: Request, res: Response ) {
    const fldsString = [
      'fabricante',
      'marca',
      'name',
      'rubro',
      'linea',
      'especie',
      'raza',
      'edad',
    ];
  
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { fullName: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
    if(params.fabricante_id && params.fabricante_id !== 'undefined') filter['fabricante_id'] = new ObjectID(params.fabricante_id);
    if(params.marca_id && params.marca_id !== 'undefined') filter['marca_id'] = new ObjectID(params.marca_id);
		
		const count = await articulo.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    let status = 0;
    let ret = {}
    try {
      const data = await articulo.find(filter).limit(params.limit).skip(params.offset).sort(params.sort);
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
		console.log(ret);
    res.status(status).json(ret);
	}

	async lista( req: Request, res: Response ) {
		try {
			//const rpta = await articulo.find().populate({path: 'presentaciones', populate: {path: 'relacion'}});
			const rpta = await articulo.find();
			res.status(200).json(rpta);
		} catch (error) {
			res.status(error.status).json(error);
		}
	}

	async flista( req: Request, res: Response ) {
		try {
			const rpta = await articulo.find().populate({path: 'presentaciones', populate: {path: 'relacion'}});
			res.status(200).json(rpta);
		} catch (error) {
			res.status(error.status).json(error);
		}
	}

	async import( req: Request, res: Response ){
		try {
			if ( req.body._id ) req.body._id = new ObjectID( req.body._id );
			const newReg = await articulo
			.updateOne({ _id: req.body._id },   // Query parameter
				{ $set: req.body }, 
				{ upsert: true }    // Options
			 );
			res.status(200).json({ msg: 'Registro creado satisfactoriamente', newReg });
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}

	async add( req: Request, res: Response ){
		try {
			if ( req.body._id ) req.body._id = new ObjectID( req.body._id );
			const newReg = await articulo.updateOne({ _id: req.body._id },   // Query parameter
																							{ $set: req.body }, 
																							{ upsert: true }    // Options
	 																					)
			res.status(200).json({ msg: 'Registro creado satisfactoriamente', newReg });

		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}

	async modifica( req: Request, res: Response) {
		try {
			if ( req.body._id ) req.body._id = new ObjectID( req.body._id );
			const rpta = await articulo.updateOne({ _id: req.body._id },   // Query parameter
				{ $set: req.body }, 
				{ upsert: true }    // Options
			);
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
		}
	}


}

export const articuloCtrl = new ArticuloControler();