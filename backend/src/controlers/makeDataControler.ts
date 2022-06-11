import { Request, Response, Router } from "express";
import presentacion, { IPresentacion } from "../models/presentaciones";
import articulo, { IArticulo } from "../models/articulos";

class MakeDataControler {

	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/make/articulo', this.articulo );
    this.router.get('/make/tablas', this.tablas)
    this.router.get('/make/presentacion',
        this.presentacion );
    this.router.get('/make/productoname',
        this.productoname );
    this.router.get('/make/precio',
        this.precio );
  }

  async articulo( req: Request, res: Response){
    const rpta = [];
		try {
    //  const varios = [
		//		{'field': 'especie', 'value': 'gato', 'newValue': 'Gato' },
    //    //
    //    {'field': 'edad', 'value': 'senior', 'newValue': 'Senior' },
    //    //
    //    {'field': 'raza', 'value': 'Mini', 'newValue': 'Minis' },
		//		{'field': 'raza', 'value': 'Minis Pequeñas', 'newValue': 'Minis y Pequeñas' },
		//		{'field': 'raza', 'value': 'Pequeña', 'newValue': 'Pequeñas' },
		//		{'field': 'raza', 'value': 'Medina y Grande', 'newValue': 'Medianas y Grandes' },
		//		{'field': 'raza', 'value': 'Medianas Grandes', 'newValue': 'Medianas y Grandes' },
    //    //
    //    {'field': 'tags', 'value': 'semior', 'newValue': 'Senior' },
		//		{'field': 'tags', 'value': 'urinario', 'newValue': 'Urinario' },
		//		{'field': 'tags', 'value': 'sanitarias,benonita', 'newValue': 'sanitarias,benonita,aglutinante' },
		//		{'field': 'tags', 'value': 'senior', 'newValue': 'Senior,Adulto' },
		//		{'field': 'tags', 'value': 'senior,adulto', 'newValue': 'Senior,Adulto' },
		//		{'field': 'tags', 'value': 'sobrecito', 'newValue': 'Sobrecitos' },
		//		{'field': 'tags', 'value': 'sobrecitos', 'newValue': 'Sobrecitos' },
		//		{'field': 'tags', 'value': 'Urinario', 'newValue': 'Urinario,Urinary' },
		//		{'field': 'tags', 'value': 'urinary.urinario', 'newValue': 'Urinario,Urinary' },
		//		{'field': 'tags', 'value': 'medicados, dermatologico, piel sensible', 'newValue': 'Medicados,Dermatologico,Piel Sensible' },
		//		{'field': 'tags', 'value': 'sanitarias,benonita,aglutinante', 'newValue': 'Sanitarias,Benonita,Aglutinante' },
		//		{'field': 'tags', 'value': 'medicados, gastrointestinal', 'newValue': 'Medicados,Gastrointestinal' },
		//	]
		//	for (let i = 0; i < varios.length; i++) {
		//		const par = varios[i];
		//		const filter = {}
		//		filter[par.field] = par.value;
		//		const newValue = {}
		//		newValue[par.field] = par.newValue
		//		rpta.push( await articulo.updateMany(filter,   // Query parameter
		//			{ $set: newValue }, 
		//			{ upsert: false }    // Options
		//		));
		//	}
      rpta.push({next: 'http://fofware.com.ar:4444/make/tablas'});
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
		}
	}
  async tablas(req: Request, res: Response){
    const varios = [
      {'field': 'especie', 'value': 'gato', 'newValue': 'Gato' },
      //
      {'field': 'edad', 'value': 'senior', 'newValue': 'Senior' },
      //
      {'field': 'raza', 'value': 'Mini', 'newValue': 'Minis' },
      {'field': 'raza', 'value': 'Minis Pequeñas', 'newValue': 'Minis,Pequeñas' },
      {'field': 'raza', 'value': 'Pequeña', 'newValue': 'Pequeñas' },
      {'field': 'raza', 'value': 'Medina y Grande', 'newValue': 'Medianas,Grandes' },
      {'field': 'raza', 'value': 'Medianas Grandes', 'newValue': 'Medianas,Grandes' },
      //
      {'field': 'tags', 'value': 'semior', 'newValue': 'eenior' },
      {'field': 'tags', 'value': 'urinario', 'newValue': 'urinario' },
      {'field': 'tags', 'value': 'sanitarias,benonita', 'newValue': 'sanitarias,benonita,aglutinante' },
      {'field': 'tags', 'value': 'senior', 'newValue': 'senior,adulto' },
      {'field': 'tags', 'value': 'senior,adulto', 'newValue': 'senior,adulto' },
      {'field': 'tags', 'value': 'sobrecito', 'newValue': 'sobrecitos' },
      {'field': 'tags', 'value': 'sobrecitos', 'newValue': 'sobrecitos' },
      {'field': 'tags', 'value': 'Urinario', 'newValue': 'urinario,urinary' },
      {'field': 'tags', 'value': 'urinary.urinario', 'newValue': 'urinario,urinary' },
      {'field': 'tags', 'value': 'medicados, dermatologico, piel sensible', 'newValue': 'medicados,dermatologico,piel sensible' },
      {'field': 'tags', 'value': 'sanitarias,benonita,aglutinante', 'newValue': 'sanitarias,benonita,aglutinante' },
      {'field': 'tags', 'value': 'medicados, gastrointestinal', 'newValue': 'medicados,gastrointestinal' },
    ]
    const rpta = [];
    for (let i = 0; i < varios.length; i++) {
      const par = varios[i];
      const filter = {}
      filter[par.field] = par.value;
      const newValue = {}
      newValue[par.field] = par.newValue
      rpta.push( await articulo.updateMany(filter,   // Query parameter
        { $set: newValue }, 
        { upsert: false }    // Options
      ));
    }
    const fabricante = await articulo.distinct('fabricante');
		const marca = await articulo.distinct('marca');
		const rubro = await articulo.distinct('rubro');
		const linea = await articulo.distinct('linea');
		const especie = await articulo.distinct('especie');
		const raza = await articulo.distinct('raza');
		const edad = await articulo.distinct('edad');
		const name = await articulo.distinct('name');
		const tags = await articulo.distinct('tags');
		res.status(200).json({fabricante,marca,rubro,linea,especie,raza,edad,name,tags});
  }
  async presentacion(req: Request, res: Response){
    res.status(200).json('presentacion');
  }

  async productoname(req: Request, res: Response){
    const array = await presentacion.find().populate({path: 'relacion'}).populate({path: 'articulo'});
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      const e:any = array[i];
      let tags = (e.articulo.tags ? e.articulo.tags : '');
      if(e.tags){
        if(tags.length) tags = (`${tags},${e.tags}`).trim();
        else tags = e.tags;
      }
      ret.push(
        {
          _id: e._id,
          articulo: e.articulo._id,
          ean: e.ean,
          plu: e.plu,
          fabricante: e.articulo.fabricante,
          marca: e.articulo.marca,
          especie: e.articulo.especie,
          raza: e.articulo.raza,
          edad: e.articulo.edad,
          rubro: e.articulo.rubro,
          linea: e.articulo.linea,
          tags,
          image: e.image ? e.image : e.articulo.image,
          fullname: e.fullname,
          pesable: e.pesable,
          pCompra: e.pCompra,
          pVenta: e.pVenta,
        }
      );
      
    }
    res.status(200).json({ret,array});
  }

  async precio(req: Request, res: Response){
    res.status(200).json('precio');
  }
}

export const makeCtrl = new MakeDataControler();
