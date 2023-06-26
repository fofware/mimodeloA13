import { Request, Response, Router } from "express";
import User, { IUser } from "../models/user";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from "passport";
import { ObjectId } from 'bson';

/*
export const list = async ( req: Request, res: Response ) =>{
  User.find({}, {password: 0}).sort({name: 1})
  .then( rpta  =>{
    return res.status(200).json(rpta);
  })
  .catch( err =>{
    return res.status(500).json( {error: err});
  } )
}

export const del = async ( req: Request, res: Response ) =>{
  const { id } = req.params
  User.findByIdAndDelete(id)
  .then( rpta  =>{
    console.log(rpta);
    return res.status(200).json(rpta);
  }).catch( err =>{
    return res.status(500).json( {error: err});
  } )
}

export const get = async ( req: Request, res: Response ) =>{
  const { id } = req.params
  User.findById(id, {password: 0})
  .then( rpta => {
    return res.status(200).json(rpta);
  }).catch( err => {
    return res.status(500).json( {error: err});
  })
}

export const put = async ( req: Request, res: Response) => {
  const { id } = req.params;
  User.findOneAndUpdate ({_id: id}, { $set :  req.body  })
  .then( ret => {
    return res.status(200).json({ msg:"Update Ok" });
  }).catch (err => {
    return res.status(500).json( {error: err});
  })
}

export const add = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({ msg: 'eMail ya existe' });
  if (req.body.password !== req.body.password2)
    return res.status(400).json({msg: 'Las contraseñas no coinciden'})
  delete req.body.password2;
  const newUser = new User(req.body);

  await newUser.save();
  return res.status(200).json({ msg: 'Usuario creado satisfactoriamente' });
};

export const buscar = async ( req: Request, res: Response ) => {
  const { search } = req.params;
  { $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] }  
  const qry = { $or: [ {"apellido": { $regex: new RegExp( search , 'i') }}, {"nombre": { $regex: new RegExp( search , 'i')}} ] }
  console.log(qry)
  User.find( qry ).sort({name: 1})
  .then( rpta => {
    return res.status(200).json(rpta);
  }).catch( err => {
    return res.status(500).json( {error: err});
  })
}

*/

class UserControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
    this.router.get('/api/user/profile',passport.authenticate('jwt', {session:false}), this.profile );
    this.router.get('/users/list',
				//passport.authenticate('jwt', {session:false}), 
				this.list );
    this.router.get('/api/users/search/:search',passport.authenticate('jwt', {session:false}), this.buscar );
    this.router.delete('/api/user/:id',passport.authenticate('jwt', {session:false}), this.delete );
    this.router.get('/api/user/:id',passport.authenticate('jwt', {session:false}), this.get );
    this.router.put('/api/user/:id',passport.authenticate('jwt', {session:false}), this.put );
    this.router.post('/api/user/add',passport.authenticate('jwt', {session:false}), this.add );
    this.router.post('/api/user/import',passport.authenticate('jwt', {session:false}),this.import );
  }

	public index(req: Request, res: Response) {
		res.send('Usuarios');
	}

	async profile(req: Request, res: Response) {
		//console.log(req.user);
		const user = await User.findById(req.user['_id'],{ password: 0 });
		console.log("----------------- profile -------------------------");
		console.log(user)
		res.json(user);
	}

	async list(req: Request, res: Response) {
		//console.log(req.user);
		const users = await User.find().sort({name: 1});
		res.json(users);
	}

	async import(req: Request, res: Response) {
		try {
      if ( req.body._id ) req.body._id = new ObjectId( req.body._id );
			const newReg = await User.updateOne(
								{ _id: req.body._id, email: req.body.email },   // Query parameter
								{ $set: req.body }, 
								{ upsert: true }    // Options
							);
			res.status(200).json({ msg: 'Registro creado satisfactoriamente', newReg });
    } catch (error) {
			res.status(500).json(error);
		}
	}

  async get(req: Request, res: Response) {
		const { id } = req.params
		User.findById(id)
		.then( (rpta: any) => {
			return res.status(200).json(rpta);
		}).catch( (err: any) => {
			return res.status(404).json( err );
		})
	}

	async delete( req: Request, res: Response ){
		const { id } = req.params;
		User.findByIdAndDelete(id).then( (rpta: any) => {
			console.log(rpta)
			res.status(200).json(rpta);
		}).catch((err: any) => {
			console.log(err);
			res.status(500).json(err);
		})
	}

	async add( req: Request, res: Response ){
		const art = await User.findOne({ name: req.body.email });
		if (art)
			return res.status(400).json({ msg: 'Usuario ya existe', art });
			const newArticulo = new User(req.body);
			await newArticulo.save();
			return res.status(200).json({ msg: 'Usuario creado satisfactoriamente', newArticulo });
	}

	async put( req: Request, res: Response) {
		const { id } = req.params;
		User.findOneAndUpdate ({_id: id}, { $set :  req.body  })
		.then( (_ret: any) => {
			return res.status(200).json({ msg:"Update Ok" });
		}).catch ((err: any) => {
			return res.status(500).json( {error: err});
		})
	}

	buscar ( req: Request, res: Response ) {
		const { search } = req.params
    const qry = { $or: [ {"apellido": { $regex: new RegExp( search , 'i') }}, {"nombre": { $regex: new RegExp( search , 'i')}} ] }
		User.find( qry ).sort({name: 1})
		.then( (rpta: any) => {
			return res.status(200).json(rpta);
		}).catch( (err: any) => {
			return res.status(500).json( {error: err});
		})
	}

}

export const userCtrl = new UserControler();