import { Request, Response, Router, urlencoded } from 'express';
import { ObjectID } from 'bson'
import passport from "passport";
import articulo, { IArticulo } from '../models/articulos';
import { makeFilter } from '../common/utils';
import { SucursalesControler } from '../mp/controlers/sucursalesControler';

export const art_full_name_template = 
{ $trim: 
	{ input: 
		{	$concat: [
			{ $cond: ['$d_fabricante', '$fabricante.name', '']},
			{ $cond: ['$d_marca', ' ', '']},
			{ $cond: ['$d_marca', '$marca.name', '']},
			{ $cond: [ { $or: ['$d_marca','$d_fabricante'] }, ' ', '']},
			{ $cond: ['$d_especie', ' ', '']},
			{ $cond: ['$d_especie', '$especie.name', '']},
			{ $cond: [ { $or: ['$d_marca','$d_fabricante',,'$d_especie'] }, ' ', '']},
			{ $cond: ['$name', '$name', '']},
			{ $cond: ['$d_edad', ' ', '']},
			{ $cond: ['$d_edad', '$edad.name', '']},
			{ $cond: ['$d_talla', ' ', '']},
			{ $cond: ['$d_talla', '$talla.name', '']},
			{ $cond: ['$d_rubro', ' ', '']},
			{ $cond: ['$d_rubro', '$rubro.name', '']},
			{ $cond: ['$d_linea', ' ', '']},
			{ $cond: ['$d_linea', '$linea.name', '']},
			]
		}
	}
}

class ArticuloControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
		this.router.get( '/articulos', this.list );
		this.router.get( '/articulos/:id', this.data );
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
			.populate('talla')
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
      'tags',
			'fabricante.name',
			'marca.name',
			'rubro.name',
			'linea.name',
			'especie.name',
			'talla.name',
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
		let status = 0;
		let ret = {}
		let count = 0;
		try {
			const total = await articulo.aggregate([
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
						from: 'tallas',
						localField: 'talla',
						foreignField: '_id',
						as: 'talla'
					}
        
				},
				{
					$unwind: "$talla"
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
				{ $count: 'total'}
			])
      console.log('total', total);
			count = total[0]?.total;
		} catch (error) {
			console.log(error);
			return res.status(400).json(error);
		}
		console.log('count',count);
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;
    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
		
		try {
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
						from: 'tallas',
						localField: 'talla',
						foreignField: '_id',
						as: 'talla'
					}
				},
				{
					$unwind: "$talla"
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
				{
					$lookup: {
						from: 'presentacions',
						localField: '_id',
						foreignField: 'articulo',
						as: 'presentaciones'
					}
				},
				{
					$lookup: {
						from: 'precios',
						localField: 'presentaciones._id',
						foreignField: '_id',
						as: 'precios'
					}
				},
				{
					$graphLookup: {
						 from: "presentacions",
						 startWith: "$presentaciones._id",
						 connectFromField: "presentaciones.relacion",
						 connectToField: "_id",
						 as: "presentaciones"
					}
			 	},

			 	{
					$project:{
						_id: 1,
						articulo: 1,
						d_fabricante: 1,
						d_marca: 1,
						d_name: 1,
						d_especie: 1,
						d_talla: 1,
						d_edad: 1,
						d_rubro: 1,
						d_linea: 1,
						fabricante: '$fabricante.name',
						marca: '$marca.name',
						name: 1,
						especie: '$especie.name',
						talla: '$talla.name',
						edad: '$edad.name',
						rubro: '$rubro.name',
						linea: '$linea.name',
						fullnameM: art_full_name_template,
						presentaciones: 1,
						presentacionesv: 1,
						precios: 1,
						//reportingHierarchy: 1,
						detalles: 1,
						images: 1,
						videos: 1,
						url: 1,
					}
				},
				{
					//$sort: { 'fullnameM': 1 }
					$sort: { 'fullnameM': 1, 'fabricante': 1, 'marca': 1, 'rubro': 1, 'linea': 1,'especie': 1, 'edad': 1, 'name': 1, 'talla': 1 }
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
				//if(reg.d_rubro){
					reg['fullname'] += sep+reg.rubro;
					sep = ' ';
				//}
				//if(reg.d_linea){
					reg['fullname'] += sep+reg.linea;
					sep = ' ';
				//}
				//if(reg.d_marca){
					reg['fullname'] += sep+reg.marca;
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
					reg['fullname'] += sep+reg.talla;
					sep = ' ';
				//}
				
				reg.presentaciones.map((pres:any, idx: number, array:any[]) => {
					const index = reg.precios.findIndex( v => `${v._id}` === `${pres._id}`);
					pres.precio = reg.precios[index].value;
					pres.fullname = `${pres.name} de ${pres.contiene} ${pres.unidad}`;
					if(pres.relacion !== null){
						const index = array.findIndex( v => `${v._id}` === `${pres.relacion}`);
						if(index > -1){
							pres.fullname = `${pres.name} con ${pres.contiene} ${array[index].name} de ${array[index].contiene} ${array[index].unidad}`;
						}
					}
				});
				//reg.presentaciones.sort((a, b) => {
				//	let fa = a.fullname.toLowerCase(),
				//			fb = b.fullname.toLowerCase();
			//
				//	if (fa < fb) {
				//			return -1;
				//	}
				//	if (fa > fb) {
				//			return 1;
				//	}
				//	return 0;
				//});
			
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

	async data( req: Request, res: Response ) {
		const id = req.params.id
		try {
			//const rpta = await articulo.find().populate({path: 'presentaciones', populate: {path: 'relacion'}});
			const rpta = await articulo.findById(id);
			res.status(200).json(rpta);
		} catch (error) {
			res.status(error.status).json(error);
		}
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