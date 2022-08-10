import { Request, Response, Router, urlencoded } from 'express';
import { ObjectID } from 'bson'
import passport from "passport";
import articulo, { IArticulo } from '../models/articulos';
import { makeFilter } from '../common/utils';
import { SucursalesControler } from '../mp/controlers/sucursalesControler';

class ArticuloControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
		this.router.get( '/articulos', this.list );
		this.router.post('/articulos/lista', this.list)
		this.router.get( '/articulos/lista', this.lista );
		this.router.get( '/articulos/full/lista', this.flista );
		this.router.post( '/articulos/public', this.public );
	}

	async list( req: Request, res: Response ) {
    const fldsString = [
      'sText',
      'tags',
    ];
  
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { fullname: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
    if(params.fabricante && params.fabricante !== 'undefined') filter['fabricante'] = params.fabricante;
    if(params.marca && params.marca !== 'undefined') filter['marca'] = params.marca;
		
		const count = await articulo.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    let status = 0;
    let ret = {}
    try {
      const rows = await articulo
			.find(filter)
			.populate('fabricante')
			.populate('marca')
			.populate('rubro')
			.populate('linea')
			.populate('especie')
			.populate('raza')
			.populate('edad')
			.limit(params.limit)
			.skip(params.offset)
			.sort(params.sort);
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

	async public( req: Request, res: Response ) {
    const fldsString = [
      //'sText',
      //'tags',
			'fabricante.name',
			'marca.name',
			'rubro.name',
			'linea.name',
			'especie.name',
			'raza.name',
			'edad.name',
			'name',
			'detalles'
    ];
  
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: {'fullname':1},
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
    if(params.fabricante && params.fabricante !== 'undefined') filter['fabricante'] = params.fabricante;
    if(params.marca && params.marca !== 'undefined') filter['marca'] = params.marca;
		
		const count = await articulo.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    let status = 0;
    let ret = {}
    try {
			//const rows = await articulo.find(filter)
			//			.populate({
			//				path: 'fabricante marca rubro linea especie edad raza', 
			//				options: {
			//					sort: {'fullname':1}
			//				}
			//			})
			//			.skip(params.offset)
			//			.limit(params.limit)
			//			//.sort(params.sort)
			const rows = await articulo.aggregate([
				{ 
					$lookup: {
						from: 'fabricantes',
						localField: 'fabricante',
						foreignField: '_id',
						as: 'fabricante'
					}
				},
				{
					$unwind: "$fabricante"
				},
				{ 
					$lookup: {
						from: 'marcas',
						localField: 'marca',
						foreignField: '_id',
						as: 'marca'
					}
				},
				{
					$unwind: "$marca"
				},
				{ 
					$lookup: {
						from: 'rubros',
						localField: 'rubro',
						foreignField: '_id',
						as: 'rubro'
					}
				},
				{
					$unwind: "$rubro"
				},
				{ 
					$lookup: {
						from: 'lineas',
						localField: 'linea',
						foreignField: '_id',
						as: 'linea'
					}
				},
				{
					$unwind: "$linea"
				},
				{ 
					$lookup: {
						from: 'especies',
						localField: 'especie',
						foreignField: '_id',
						as: 'especie'
					}
				},
				{
					$unwind: "$especie"
				},
				{ 
					$lookup: {
						from: 'razas',
						localField: 'raza',
						foreignField: '_id',
						as: 'raza'
					}
				},
				{
					$unwind: "$raza"
				},
				{ 
					$lookup: {
						from: 'edads',
						localField: 'edad',
						foreignField: '_id',
						as: 'edad'
					}
				},
				{
					$unwind: "$edad"
				},
				{ $match: filter },
				//{
				//	$addFields:
				//	{
				//		testing:{
				//			$function: {
				//				body: function( fabricante ){
				//						return `Probando ${fabricante}`;
				//				},
				//				args:[
				//					"$name"
				//				],
				//				lang: "js"
				//			} 
				//		}
				//		//fullname:
				//		//	{	$function:
				//		//		{
				//		//			body: function(
				//		//				fabricante, 
				//		//				marca, 
				//		//				especie, 
				//		//				raza, 
				//		//				edad, 
				//		//				rubro, 
				//		//				linea,
				//		//				name, 
				//		//				d_fabricante, 
				//		//				d_marca, 
				//		//				d_especie, 
				//		//				d_raza, 
				//		//				d_edad, 
				//		//				d_rubro, 
				//		//				d_linea	){
				//		//				let fullName = '';
				//		//				let sep = '';
				//		//				if(d_fabricante){
				//		//					fullName = fabricante;
				//		//					sep = ' ';
				//		//				}
				//		//				if(d_marca){
				//		//					fullName += sep+marca;
				//		//					sep = ' ';
				//		//				}
				//		//				if(name){
				//		//					fullName += sep+name;
				//		//					sep = ' ';
				//		//				}
				//		//				if(d_especie){
				//		//					fullName += sep+especie;
				//		//					sep = ' ';
				//		//				}
				//		//				if(d_edad){
				//		//					fullName += sep+edad;
				//		//					sep = ' ';
				//		//				}
				//		//				if(d_raza){
				//		//					fullName += sep+raza;
				//		//					sep = ' ';
				//		//				} 
				//		//				if(d_rubro){
				//		//					fullName += sep+rubro;
				//		//					sep = ' ';
				//		//				} 
				//		//				if(d_linea){
				//		//					fullName += sep+linea;
				//		//					sep = ' ';
				//		//				} 
				//		//				return fullName;
				//		//			},
				//		//			args: [
				//		//				'$fabricante.name', 
				//		//				'$marca.name', 
				//		//				'$especie.name', 
				//		//				'$raza.name', 
				//		//				'$edad.name', 
				//		//				'$rubro.name', 
				//		//				'$linea.name', 
				//		//				'$name',
				//		//				'$d_fabricante', 
				//		//				'$d_marca', 
				//		//				'$d_especie', 
				//		//				'$d_raza', 
				//		//				'$d_edad', 
				//		//				'$d_rubro', 
				//		//				'$d_linea'
				//		//			],
				//		//			lang: 'js'
				//		//		}
				//		//	}
				//	}
				//},
				{
					$project:{
						_id: 1,
						articulo: 1,
						d_fabricante: 1,
						d_marca: 1,
						d_name: 1,
						d_especie: 1,
						d_raza: 1,
						d_edad: 1,
						d_rubro: 1,
						d_linea: 1,
						fabricante: '$fabricante.name',
						marca: '$marca.name',
						name: 1,
						especie: '$especie.name',
						raza: '$raza.name',
						edad: '$edad.name',
						rubro: '$rubro.name',
						linea: '$linea.name',
						detalles: 1,
						images: 1,
						videos: 1,
						url: 1,
					}
				},
				{
					$sort: { 'fabricante': 1, 'marca': 1, 'rubro': 1, 'linea': 1,'especie': 1, 'edad': 1, 'name': 1, 'raza': 1 }
				},
				{ $skip: params.offset},
				{ $limit: params.limit},
			])
			rows.map((reg) =>{
				reg['fullname']  = '';
				let sep = '';
				//if(reg.d_fabricante){
					reg['fullname'] = reg.fabricante;
					sep = ' ';
				//}
				//if(reg.d_marca){
					reg['fullname'] += sep+reg.marca;
					sep = ' ';
				//}
				//if(reg.d_rubro){
					reg['fullname'] += sep+reg.rubro;
					sep = ' ';
				//}
				//if(reg.d_linea){
					reg['fullname'] += sep+reg.linea;
					sep = ' ';
				//}
				//if(reg.d_especie){
					reg['fullname'] += sep+reg.especie;
					sep = ' ';
				//}
				//if(reg.d_edad){
					reg['fullname'] += sep+reg.edad;
					sep = ' ';
				//}
				if (reg.name){
					reg['fullname'] += sep+reg.name;
					sep = ' ';
				}
				//if(reg.d_raza){
					reg['fullname'] += sep+reg.raza;
					sep = ' ';
				//}
				
			})
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
			const rpta = await articulo
			.find()
			.populate({path: 'presentaciones', populate: {path: 'relacion'}});
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