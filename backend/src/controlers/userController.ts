import { Request, Response, Router } from "express";
import User, { IUser } from "../models/user";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';
import passport from "passport";
import { ObjectId } from 'bson';
import { makeFilter } from '../common/utils';

export const list = async (req: Request, res: Response ) => {
	try {
    const fldsString = [
      'email',
      'apellido',
			'nombre'
    ];
  
    const params = Object.assign({
      limit: 50,
      offset: 0,
      iniTime: new Date().getTime(),
      sort: { fullname: 1 },
      searchItem: ''
    },req.query,req.params,req.body);

    const filter = makeFilter(fldsString, params);
		
		const count = await User.count(filter);
    
    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;
    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    let status = 0;
    let ret = {}
		console.log(params);
		const rows = await User.find(filter, {password: 0});
		res.status(200).json(rows);
	} catch (error) {
		const msg = {
			title: 'Server Error',
			text: JSON.stringify(error)
		}
		res.status(500).json(msg)
	}
}
export const getById = async (req: Request, res: Response) => {
	const {id} = req.params;
	const reg = await User.findById(id, {password:0})
	res.status(200).json(reg)
}
/*
export const add = async (req: Request, res: Response) => {
	const {email, password} = req.body;
	const user = await User.find({email});
	if(user){
		const msg = {text:'email ya está registrado', title: ''};
		return res.status(400).json(msg);
	}

	const reg = await User.findById(id, {password:0})
	res.status(200).json(reg)
}
*/
export const update = async (req: Request, res: Response) => {
	const {id} = req.params;
	const reg = await User.findById(id, {password:0})
	res.status(200).json(reg)
}
export const borrar = async (req: Request, res: Response) => {
	const {id} = req.params;
	const reg = await User.findById(id, {password:0})
	res.status(200).json(reg)
}
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