// TODO: #2 Remover lineas de codigo en desuso
import { Request, Response, Router, urlencoded } from 'express';
import { ObjectID } from 'bson'
import passport from "passport";
import articulo, { IArticulo } from '../models/articulos';
import producto, { IProducto } from '../models/producto';

class ArticuloControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
		this.router.get( '/articulos/lista', this.lista );
		this.router.get( '/articulos/full/lista', this.flista );
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