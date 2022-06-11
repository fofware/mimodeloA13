import { Request, Response, Router } from 'express';
import producto, { IProducto } from '../models/producto';
import { ObjectID } from 'bson'
import passport from "passport";
import articulos from '../models/articulos'
import ProductoName from '../models/productoname'

const ahora = new Date();
const zeroTime = new Date(0);
const baseCalculo = 'reposicion';


class ProductoControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config() {
	}

	public index(req: Request, res: Response) {
		console.log(req.user);
		res.send('Productos');
	}

}

export const productoCtrl = new ProductoControler();
