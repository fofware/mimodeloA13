// TODO: #2 Remover lineas de codigo en desuso
import { Request, Response, Router, urlencoded } from 'express';
import { ObjectID } from 'bson'
import passport from "passport";
import articulo, { IArticulo } from '../models/articulos';
import producto, { IProducto } from '../models/producto';
import { productoFullTemplate, producto_cerrado_template, producto_ins_template, producto_parte_template } from './productoControler';

export const art_name_template = { $trim: 
	{ input: 
		{	$concat: [
			{ $cond: ['$art.d_fabricante', '$art.fabricante', '']},
			{ $cond: ['$art.d_marca', ' ', '']},
			{ $cond: ['$art.d_marca', '$art.marca', '']},
			{ $cond: [ { $or: ['$art.d_marca','$art.d_fabricante'] }, ' ', '']},
			'$art.name',
			{ $cond: ['$art.d_especie', ' ', '']},
			{ $cond: ['$art.d_especie', '$art.especie', '']},
			{ $cond: ['$art.d_edad', ' ', '']},
			{ $cond: ['$art.d_edad', '$art.edad', '']},
			{ $cond: ['$art.d_raza', ' ', '']},
			{ $cond: ['$art.d_raza', '$art.raza', '']},
			//{ $cond: [ { $or: ['$art.d_marca','$art.d_fabricante','$art.d_especie','$art.d_edad','$art.d_raza'] }, ' ', '']},
			//'$art.name',
			{ $cond: ['$art.d_rubro', ' ', '']},
			{ $cond: ['$art.d_rubro', '$art.rubro', '']},
			{ $cond: ['$art.d_linea', ' ', '']},
			{ $cond: ['$art.d_linea', '$art.linea', '']},
			]
		}
	}
}
export const art_full_name_template = 
	{ $trim: 
		{ input: 
			{	$concat: [
				{ $cond: ['$d_fabricante', '$fabricante', '']},
				{ $cond: ['$d_marca', ' ', '']},
				{ $cond: ['$d_marca', '$marca', '']},
				{ $cond: [ { $or: ['$d_marca','$d_fabricante'] }, ' ', '']},
				'$name',
				{ $cond: ['$d_especie', ' ', '']},
				{ $cond: ['$d_especie', '$especie', '']},
				{ $cond: ['$d_edad', ' ', '']},
				{ $cond: ['$d_edad', '$edad', '']},
				{ $cond: ['$d_raza', ' ', '']},
				{ $cond: ['$d_raza', '$raza', '']},
				{ $cond: ['$d_rubro', ' ', '']},
				{ $cond: ['$d_rubro', '$rubro', '']},
				{ $cond: ['$d_linea', ' ', '']},
				{ $cond: ['$d_linea', '$linea', '']},
				]
			}
		}
	}

export const artProject = {
	'_id': 1,
	'tags': 1,
	'fabricante': 1,
	'marca': 1,
	'rubro': 1,
	'linea': 1,
	'especie': 1,
	'edad': 1,
	'raza': 1,
	'name': 1,
	'd_fabricante': 1,
	'd_marca': 1,
	'd_rubro': 1,
	'd_linea': 1,
	'd_especie': 1,
	'd_raza': 1,
	'd_edad': 1,
	'private_web': 1,
	'image': 1,
	'url': 1,
	'iva': 1,
	'margen': 1,
	'formula': 1,
	'detalles': 1,
	'beneficios': 1,
	'fullName':	art_full_name_template,
};

export const saleProduct =
{
	from: "productos",
	let: { articuloId: "$_id" },
	pipeline: [
		{
			$match: {
				$expr:
					{ $eq: ["$articulo", "$$articuloId"] },
			}
		},
		{
			$addFields: {
				"strContiene": { $toString: '$contiene' }
			}
		},
		{
			$lookup:
			{
				from: "productos",
				let: { productoId: "$parent", pesable: "$pesable", pVenta: "$pVenta", pCompra: "$pCompra", pServicio: "$pServicio" },
				pipeline: [
					{
						$match:
						{
							$expr:
							{
								$and:
									[
										{ $eq: ["$_id", "$$productoId"] },
										// Esto nos asegura que es un producto que se vende
										// fraccionando
										{ $eq: ["$$pVenta", true] },
										{ $eq: ["$$pCompra", true] },
										//{ $eq: [ "$$pServicio", false ] },
										{ $eq: ["$$pesable", false] },
										//{ $eq: [ "$pVenta", true ] },
										//{ $eq: [ "$pCompra", true ] },
										//{ $eq: [ "$pesable", false ] }
									]
							}
						}
					},

					{
						$project: {
							_id: 1, parent: 1, name: 1, contiene: 1, unidad: 1, precio: 1, compra: 1, reposicion: 1, stock: 1, image: 1, strContiene: { $toString: '$contiene' },
						}
						//$project: { name: 1, contiene: 1, unidad: 1, _id: 0 } 
					}

				],
				as: "ins"
			}
		},
		{
			$lookup:
			{
				from: "productos",
				let: { productoId: "$parent", pesable: "$pesable", pVenta: "$pVenta", pCompra: "$pCompra", pServicio: "$pServicio" },
				pipeline: [
					{
						$match:
						{
							$expr:
							{
								$and:
									[
										{ $eq: ["$_id", "$$productoId"] },
										// Esto nos asegura que es un producto que se vende
										// fraccionando
										{ $eq: ["$$pVenta", true] },
										{ $eq: ["$$pCompra", false] },
										//{ $eq: [ "$$pServicio", false ] },
										{ $eq: ["$$pesable", true] },

										//{ $eq: [ "$pVenta", true ] },
										//{ $eq: [ "$pCompra", true ] },
										//{ $eq: [ "$pesable", false ] }
									]
							}
						}
					},
					{
						$project: { _id: 1, parent: 1, name: 1, contiene: 1, unidad: 1, precio: 1, compra: 1, reposicion: 1, stock: 1, image: 1, strContiene: { $toString: '$contiene' } }
					}
				],
				as: "parte"
			}
		},
		{
			$lookup:
			{
				from: "productos",
				let: { productoId: "$_id", pesable: "$pesable", pVenta: "$pVenta", pCompra: "$pCompra", pServicio: "$pServicio" },
				pipeline: [
					{
						$match:
						{
							$expr:
							{
								$and:
									[
										{ $eq: ["$parent", "$$productoId"] },
										// esto asegura que es un producto de venta que no se compra 
										// y se incluye dentro de este pack no se fracciona
										{ $eq: ["$$pVenta", true] },
										{ $eq: ["$$pCompra", false] },
										//{ $eq: [ "$$pServicio", false ] },
										{ $eq: ["$$pesable", false] },
										// no es necesario
										//{ $eq: [ "$pVenta", true ] },
										//{ $eq: [ "$pCompra", true ] },
										//{ $eq: [ "$pesable", false ] }
									]
							}
						}
					},

					{
						$project: { _id: 1, parent: 1, name: 1, contiene: 1, unidad: 1, precio: 1, compra: 1, reposicion: 1, stock: 1, image: 1, strContiene: { $toString: '$contiene' } }
					}
				],
				as: "cerrado"
			}
		},
		{
			$unwind: {
				path: '$parte',
				includeArrayIndex: 'count_parte',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$cerrado',
				includeArrayIndex: 'count_cerrado',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$ins',
				includeArrayIndex: 'count_ins',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$project:
			{
				"_id": 1,
				"name": 1,
				"contiene": 1,
				"strContiene": { $cond: [{ $eq: ['$count_ins', 0] }, { $concat: ['con ', '$strContiene'] }, '$strContiene'] },
				"unidad": 1,
				"compra": {
					$round: [
						{
							$cond: [{ $eq: ['$count_parte', 0] },
							{ $divide: ['$parte.compra', '$parte.contiene'] },
							{
								$cond: [{ $eq: ['$count_cerrado', 0] },
								{ $divide: ['$cerrado.compra', '$cerrado.contiene'] },
									'$compra'
								]
							}
							]
						}
						,
						3//qry.Decimales
					]
				},
				"reposicion": {
					$round: [
						{
							$cond: [{ $eq: ['$count_parte', 0] },
							{ $divide: ['$parte.reposicion', '$parte.contiene'] },
							{
								$cond: [{ $eq: ['$count_cerrado', 0] },
								{ $divide: ['$cerrado.reposicion', '$cerrado.contiene'] },
									'$reposicion'
								]
							}
							]

						}
						, 3 // qry.Decimales
					]
				},
				"promedio":
				{
					$round: [
						{
							$cond: [{ $eq: ['$count_parte', 0] },
							{ $divide: [{ $divide: [{ $add: ['$parte.reposicion', '$parte.compra'] }, 2] }, '$parte.contiene'] },
							{
								$cond: [{ $eq: ['$count_cerrado', 0] },
								{ $divide: [{ $divide: [{ $add: ['$cerrado.reposicion', '$cerrado.compra'] }, 2] }, '$cerrado.contiene'] },
								{ $divide: [{ $add: ['$reposicion', '$compra'] }, 2] }
								]
							}
							]
						}
						, 3 //qry.Decimales
					]
				},
				precio: 1,
				"calc_precio": {
					$ceil:
					{
						$cond: [{ $eq: ['$count_parte', 0] },
						{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: ['$parte.compra', '$parte.contiene'] }] },
						{
							$cond:
								[{ $eq: ['$count_cerrado', 0] },
								{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: ['$cerrado.compra', '$cerrado.contiene'] }] },
								{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$compra'] }
								]
						}]
					}
				},
				"precioref": {
					$round: [
						{
							$cond: [{ $eq: ['$count_parte', 0] },
							{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: ['$parte.compra', '$parte.contiene'] }] },
							{
								$cond: [{ $eq: ['$count_cerrado', 0] },
								{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$cerrado.compra'] }, { $cond: [{ $eq: ['$cerrado.contiene', 0] }, 1, { $multiply: ['$cerrado.contiene', '$contiene'] }] }] },
								{
									$cond: [{ $eq: ['$count_ins', 0] },
									{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$compra'] }, { $cond: [{ $eq: ['$ins.contiene', 0] }, '$contiene', { $multiply: ['$contiene', '$ins.contiene'] }] }] },
									{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$compra'] }, { $cond: [{ $eq: ['$contiene', 0] }, 1, '$contiene'] }] }
									]
								}
								]
							}
							]
						},
						{
							$cond: [
								{
									$lt: [
										{
											$cond: [{ $eq: ['$count_parte', 0] },
											{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: ['$parte.compra', '$parte.contiene'] }] },
											{
												$cond: [{ $eq: ['$count_cerrado', 0] },
												{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$cerrado.compra'] }, { $cond: [{ $eq: ['$cerrado.contiene', 0] }, 1, { $multiply: ['$cerrado.contiene', '$contiene'] }] }] },
												{
													$cond: [{ $eq: ['$count_ins', 0] },
													{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$compra'] }, { $cond: [{ $eq: ['$ins.contiene', 0] }, '$contiene', { $multiply: ['$contiene', '$ins.contiene'] }] }] },
													{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$compra'] }, { $cond: [{ $eq: ['$contiene', 0] }, 1, '$contiene'] }] }
													]
												}
												]
											}
											]
										},
										1
									]
								},
								2,
								3 //qry.Decimales

							]
						}
					]
				},
				'sub': {
					$cond: [{ $eq: ['$count_ins', 0] },
						'$ins',
					{
						$cond: [{ $eq: ['$count_parte', 0] },
							'$parte',
						{
							$cond: [{ $eq: ['$count_cerrado', 0] },
								'$cerrado',
							{ 'name': '', 'strContiene': '', 'unidad': '' }
							]
						}
						]
					}
					]
				},
				"pesable": 1,
				"servicio": 1,
				"pVenta": 1,
				"pCompra": 1,
				"codigo": 1,
				"plu": 1,
				"image": 1,
				"stock": {
					$floor:
					{
						$cond: [{ $eq: ['$count_parte', 0] },
						{ $multiply: ['$parte.stock', '$parte.contiene'] },
						{
							$cond: [{ $eq: ['$count_cerrado', 0] },
							{ $multiply: ['$cerrado.stock', '$cerrado.contiene'] },
							{
								$cond: [{ $eq: ['$ins_count', 0] },
								{ $cond: [{ $gte: ['$stock', 1] }, '$stock', 0] },
								{ $cond: [{ $gte: ['$stock', 1] }, '$stock', 0] }
								]
							}
							]
						}
						]
					}
				},
				"divisor": {
					$cond: [{ $eq: ['$count_parte', 0] },
						'$parte.contiene',
					{
						$cond: [{ $eq: ['$count_cerrado', 0] },
							'$cerrado.contiene',
						{
							$cond: [{ $eq: ['$ins_count', 0] },
								'$ins.contiene',
								1]
						}
						]
					}
					]
				},
				"scontiene": {
					$cond: [{ $eq: ['$count_parte', 0] },
						'',
					{
						$cond: [{ $eq: ['$count_cerrado', 0] },
							'',
						{
							$cond: [{ $eq: ['$count_ins', 0] },
								'$ins.contiene',
								'']
						}
						]
					}
					]
				},
				"sStrContiene": {
					$cond: [{ $eq: ['$count_parte', 0] },
						'',
					{
						$cond: [{ $eq: ['$count_cerrado', 0] },
							'',
						{
							$cond: [{ $eq: ['$count_ins', 0] },
								'$ins.strContiene',
								'']
						}
						]
					}
					]
				},
				"sname": {
					$cond: [{ $eq: ['$count_parte', 0] },
						'',
					{
						$cond: [{ $eq: ['$count_cerrado', 0] },
							'',
						{
							$cond: [{ $eq: ['$count_ins', 0] },
								'$ins.name',
								'']
						}
						]
					}
					]
				},
				"sunidad": {
					$cond: [{ $eq: ['$count_parte', 0] },
						'',
					{
						$cond: [{ $eq: ['$count_cerrado', 0] },
							'',
						{
							$cond: [{ $eq: ['$count_ins', 0] },
								'$ins.unidad',
								'']
						}
						]
					}
					]
				},
				"stockMin": 1,
				"iva": 1,
				"margen": 1,
				"tipo": 1,
				//'ins': 1,
				'count_ins': 1,
				//'cerrado':1,
				'count_cerrado': 1,
				//'parte':1,
				'count_parte': 1,
				'parent': 1
			}
		},
		{
			$sort: { 'name': 1, 'contiene': -1, 'sub.contiene': -1 }
		}

	],
	as: "productos"
};

export const dataProduct = (params) => {
	if(!params.hidden) params.hidden = {nodata: 0};
	if(!params.sort) params.sort = { 'name': 1, 'contiene': 1, 'sub.contiene': 1 };
	return {
		from: "productos",
		let: { articuloId: "$_id" },
		pipeline: [
			{
				$match: {
					$expr:
						{ $eq: ["$articulo", "$$articuloId"] },
				}
			},
			{
				$addFields: {
					"strContiene": { $toString: '$contiene' }
				}
			},
			{
				$lookup: producto_ins_template()
			},
			{
				$lookup: producto_parte_template()
			},
			{
				$lookup: producto_cerrado_template()
			},
			{
				$unwind: {
					path: '$parte',
					includeArrayIndex: 'count_parte',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$unwind: {
					path: '$cerrado',
					includeArrayIndex: 'count_cerrado',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$unwind: {
					path: '$ins',
					includeArrayIndex: 'count_ins',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$project: productoFullTemplate
			}
			,{
				$project: {
					"_id": 1,
					"name": 1,
					"contiene": 1,
					"strContiene": 1,
					"unidad": 1,
					"compra": 1,
					"showCompra" : 1,
					"reposicion": 1,
					'lista': 1,
					"calc_precio": 1, 
					"showPrecio": 1,
					"oferta": {$lt:['$showPrecio','$calc_precio']},
					'reventa': { $cond: [{$lt:['$reventa','$showPrecio']},'$reventa','$showPrecio']},
					'reventa1': { $cond: [{$lt:['$reventa1','$showPrecio']},'$reventa1','$showPrecio']},
					'reventa2': { $cond: [{$lt:['$reventa2','$showPrecio']},'$reventa2','$showPrecio']},
					'precio': 1,
					'precio_desde': 1,
					'precio_hasta': 1,
					'sub': 1,
					"pesable": 1,
					"servicio": 1,
					"pVenta": 1,
					"pCompra": 1,
					"codigo": 1,
					"plu": 1,
					"image": 1,
					"stock": 1,
					"scontiene": 1,
					"sStrContiene": 1,
					"sname": 1,
					"sunidad": 1,
					"stockMin": 1,
					"iva": 1,
					"margen": 1,
					"tipo": 1,
					//'ins': 1,
					'count_ins': 1,
					//'cerrado':1,
					'count_cerrado': 1,
					//'parte':1,
					'count_parte': 1,
					'parent': 1
				}
			}
			,{
				$sort: params.sort
			}
			,{
				$project: params.hidden
			}
		],
		as: "productos"
	};
}


export const readArticulos = async function (qry: any): Promise<any> {
	if (!qry.Articulo) qry.Articulo = {};
	if (!qry.Sort) qry.Sort = { fullName: 1 };
	if (!qry.Project) qry.Project = artProject;
	try {
		const rpta = await articulo.aggregate([
			{ $match: qry.Articulo },
			{
				$project: qry.Project
			},
			{
				$sort: qry.Sort
			}
		]);
		return rpta;
	} catch (error) {
		console.log(error);
		return { error };
	}
}

export const readProductos1 = function ( qry: any ): PromiseLike<any[]> {
	if (!qry.Articulo) qry.Articulo = {};
	if (!qry.Producto) qry.Producto = {};
	if (!qry.Project){
		qry.Project = artProject; 
		qry.Project.productos = 1;
	}
	if (!qry.Sort) qry.Sort = {fullName: 1};
	return articulo.aggregate([
		{ $match: qry.Articulo }
		,{ $graphLookup:
			{
				from: "productos"
				,startWith: "$_id"
				,connectFromField: "parent"
				,connectToField: "articulo"
				,as: "productos"
				,restrictSearchWithMatch: qry.Producto
			}
		},
		{
			$project: qry.Project
		},
		{
			$sort: qry.Sort
		}
	]);
}	

export const readProductos = function ( qry: any, prodTemplate ): PromiseLike<any[]> {
	if (!qry.Articulo) qry.Articulo = {};
	if (!qry.Producto) qry.Producto = {};
	if( !qry.showData) qry.showData = { 'noproject': 0}
	if( !qry.hiddenData) qry.hiddenData = { 'noproject': 0}
	if( !qry.Extra ) qry.Extra = {};

	if (!qry.Project){
		qry.Project = artProject; 
		qry.Project.productos = 1;
	}
	if (!qry.Sort) qry.Sort = {fullName: 1};
	qry.Decimales = 0;
	console.log(prodTemplate);
	return articulo.aggregate(
		[
			{ $match: qry.Articulo },
			{
				$lookup: prodTemplate
			},
			{
				$project: qry.Project
			},
			{ $project: qry.showData },
			{
				$match: qry.Extra
			},
			{
				$project: qry.hiddenData
			},
			{
				$sort: qry.Sort
			}
		]);
}	
export const articuloTextSearch = async function (search) {
	return await articulo.find({ $text: { $search: search } } );
}

export const articuloSanitize = async function (qry: any) {
	const artFlds = ['fabricante', 'marca', 'rubro', 'linea', 'especie', 'edad', 'raza', 'tags', 'name'];
	const extFlds = ['tags', 'name', 'fullName'];
	let Articulo = {};
	const Extra = {};
	console.log(decodeURI(qry.searchItem));
	let searchItem = qry.searchItem ? qry.searchItem.replace(/  /g, ' ') : '';
	const searcharray: any[] = searchItem.trim().split(' ');
	let e = [];
	let lista = [];
	// setea según botonera
	if (qry.Articulo){
		for (const key in qry.Articulo) {
			if (Object.prototype.hasOwnProperty.call(qry.Articulo, key)) {
				const e = qry.Articulo[key];
				Articulo[key] = (e['$regex'] ? {$regex: new RegExp(e['$regex'].patern, e['$regex'].flags )} : e); 
				const idx = artFlds.indexOf(key);
				if( idx !== -1){
					artFlds.splice ( idx, 1)
				}
			}
		}
	}
	/*
	if (qry.Extra){
		for (const key in qry.Extra) {
			if (Object.prototype.hasOwnProperty.call(qry.Extra, key)) {
				const e = qry.Extra[key];
				Extra[key] = (e['$regex'] ? {$regex: new RegExp(e['$regex'].patern, e['$regex'].flags )} : e); 
				const idx = extFlds.indexOf(key);
				if( idx !== -1){
					extFlds.splice ( idx, 1)
				}
			}
		}
	}
	const extRegEx = []
	*/
	if (searcharray.length > 0){
		/*
		for (let i = 0; i < searcharray.length; i++) {
			extRegEx.push(new RegExp( searcharray[i], 'i' )); 
		}
		for (let i = 0; i < extFlds.length; i++) {
			const fld = extFlds[i];
			const o = {};
			o[fld] = {'$in': extRegEx }
			e.push(o)
		}
		Extra['$or'] = e;
		*/
		const v = [];
		const regStr = [];
		for (let i = 0; i < searcharray.length; i++) {
			const str = searcharray[i];
			const v = [];
			for (let n = 0; n < artFlds.length; n++) {
				const fld = artFlds[n];
				const o = {};
				o[fld] = new RegExp( str, 'i' );
				v.push(o);
			}
			Articulo['$or'] = v;
			//console.log(v)
			if( i > 0 ) Articulo['_id'] = {'$in': lista};
			console.log(Articulo);
			const slista = await articulo.aggregate([{ '$match': Articulo },{'$project': {'_id': 1}}]);
			console.log(slista.length);
			if (slista.length){
				lista = slista;
				for (let index = 0; index < lista.length; index++) {
					lista[index] = new ObjectID(lista[index]._id);
				}
			}
			else {
				console.log(str)
			}
		}
	}

	if(Articulo['_id'] && Articulo['_id'].length === 0) delete Articulo['_id'];
	if(Articulo['$or'] && Articulo['$or'].length === 0) delete Articulo['$or'];
	if(Articulo['$and'] && Articulo['$and'].length === 0) delete Articulo['$and'];
	if(lista.length) Articulo['_id'] = {'$in': lista }
	return { Articulo, lista, Extra } 
}

export const articuloSanitizeString = function (search: string, artQry?: any) {
//	if(!search || search.length == 0) return null;
	artQry = (artQry ? artQry : {});
	const Articulo = [];
	const Extra = [];

	const searchItem = search.replace(/  /g, ' ');
	const array: any[] = searchItem.trim().split(' ');
	const artFlds = ['name','fabricante','marca','rubro', 'linea', 'especie', 'edad', 'raza', 'tags'];
	const a = [];
	const e = [];
	const keys = []
/*
	for (const key in artQry) {
		if (Object.prototype.hasOwnProperty.call(artQry, key)) {
			keys.push(key);
			switch (artQry[key].qryValue) {
				case '$regex':
					v[fld] = { $regex: new RegExp(artQry.qryValue['$regex']) }
					break;
				default:
					v[fld] = artQry.qryValue
					break;
			}
			console.log("v", fld, v);
			a.push( v ); 
		}
	}
*/
	console.log("articuloControler-artQry", artQry);
		for (let i = 0; i < artFlds.length; i++) {
			const fld = artFlds[i];
			const v = {};
			if (artQry[fld]){
				switch (artQry.qryValue) {
					case '$regex':
						v[fld] = { $regex: new RegExp(artQry.qryValue['$regex']) }
						break;
					default:
						v[fld] = artQry.qryValue
						break;
				}
//				console.log("v", fld, v);
				a.push( v ); 
			} else {
				for (let index = 0; index < array.length; index++) {
					const element = array[index];
					v[fld] = {$regex: new RegExp( `${element}`)};
				}
			}
/*
		const o = [{'name': {$regex: new RegExp( `${element}` , 'i')}},
			{'fabricante': {$regex: new RegExp( `${element}` , 'i')}},
			{'marca': {$regex: new RegExp( `${element}` , 'i')}},
			{'rubro': {$regex: new RegExp( `${element}` , 'i')}},
			{'linea': {$regex: new RegExp( `${element}` , 'i')}},
			{'especie': {$regex: new RegExp( `${element}` , 'i')}},
			{'edad': {$regex: new RegExp( `${element}` , 'i')}},
			{'raza': {$regex: new RegExp( `${element}` , 'i')}},
			{'tags': {$regex: new RegExp( `${element}` , 'i')}}
		];

		const e = [
			{'fullName': {$regex: new RegExp( `${element}` , 'i')}},
			{'fabricante': {$regex: new RegExp( `${element}` , 'i')}},
			{'marca': {$regex: new RegExp( `${element}` , 'i')}},
			{'rubro': {$regex: new RegExp( `${element}` , 'i')}},
			{'linea': {$regex: new RegExp( `${element}` , 'i')}},
			{'especie': {$regex: new RegExp( `${element}` , 'i')}},
			{'edad': {$regex: new RegExp( `${element}` , 'i')}},
			{'raza': {$regex: new RegExp( `${element}` , 'i')}},
			{'tags': {$regex: new RegExp( `${element}` , 'i')}}
		];
*/
		Articulo.push({'$or': a });
		Extra.push({'$or': e });
	}
	return { Articulo, Extra } ;
}

class ArticuloControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config () {
		this.router.get( '/articulo/:id', this.leer );
		this.router.get( '/articulo/productos/:id', this.leerProductos );

		this.router.delete( '/articulo/:id', this.delete );
		this.router.post( '/articulo', this.add );
		this.router.post( '/articulo/import', this.import );
		this.router.put( '/articulo/:id', this.modifica );

		this.router.get( '/articulos/test/:search', this.test );
		this.router.get( '/articulos/lista', this.lista );
		this.router.get( '/articulos/list', this.searchArticulos );
		this.router.get( '/articulos/list/:search', this.searchArticulos )
		this.router.post( '/articulos/list', this.findArticulos );

//		this.router.get( '/articulos/productos/list', passport.authenticate('jwt', { session: false }), this.productosList );
//		this.router.post( '/articulos/productos/list', passport.authenticate('jwt', { session: false }), this.productosList );



		this.router.get( '/articulos/fulldata/list', this.fulldata );

		this.router.get( '/articulos/productos/list', this.searchProductos );
		this.router.get( '/articulos/productos/list/:search', this.searchProductos );
		this.router.post( '/articulos/productos/list', this.findProductos );
		this.router.post( '/articulos/productos/listdata', this.findProductosData );
		this.router.post( '/articulos/productos/listpublicdata', this.findPublicProductosData );
		this.router.post( '/articulos/productos/updatefullData', passport.authenticate('jwt', { session: false }), this.updateFullData );
//		this.router.post( '/articulos/productos/updatefullData', this.updateFullData );
		this.router.get( '/articulos/productos/text/:search', this.textSearch );
		this.router.get( '/marca',this.marca);
		this.router.get( '/cambia',this.cambia);
	}

	public index(req: Request, res: Response) {
		res.send('Articulos');
	}
	async marca(req: Request, res: Response){
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
	async leer(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const qry = {Articulo: { _id: new ObjectID(id) } };
			const rpta = await readArticulos(qry);
			return res.status(200).json(rpta);
		} catch (error) {
			return res.status(404).json( error );			
		}
	}

	async leerProductos(req: Request, res: Response) {
		try {
			const qry = {Articulo:{_id: new ObjectID(req.params.id) }};
			//const rpta = await readProductos(qry,saleProduct);

			const rpta = await readProductos(qry,dataProduct({hidden:{
				"compra": 0,
				"reposicion": 0,
				"promedio": 0,
				//	"precioref": 0,
				"stockMin": 0,
				"margen": 0,
				"art_margen": 0,
				"tipo": 0,
				'ins': 0,
				'cerrado':0,
				'parte':0,
				'sub.compra':0,
				'sub.reposicion':0
			}}));




			res.status(200).json(rpta[0])
		} catch (error) {
			res.status(404).json(error)
		}
	}

	async delete( req: Request, res: Response ){
		try {
			const { id } = req.params;
			const proddel = await producto.deleteMany( { 'articulo':  new ObjectID(id) } );
			console.log(proddel);
			const rpta = await articulo.deleteOne( { _id:  new ObjectID(id) } );
			res.status(200).json(rpta);
		} catch (error) {
			console.log(error)
			res.status(500).json(error);
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

	async cambia( req: Request, res: Response){
		try {
//			const par = Object.assign({},req.query,req.params,req.body);
			const varios = [
				{'field': 'especie', 'value': 'gato', 'newValue': 'Gato' },
				{'field': 'edad', 'value': 'senior', 'newValue': 'Senior' },
				{'field': 'raza', 'value': 'Minis Pequeñas', 'newValue': 'Minis y Pequeñas' },
				{'field': 'raza', 'value': 'Pequeña', 'newValue': 'Pequeñas' },
				{'field': 'raza', 'value': 'Medianas Grandes', 'newValue': 'Medianas y Grandes' },
				{'field': 'tags', 'value': 'semior', 'newValue': 'Senior' },
				{'field': 'tags', 'value': 'urinario', 'newValue': 'Urinario' },
				{'field': 'tags', 'value': 'sanitarias,benonita', 'newValue': 'sanitarias,benonita,aglutinante' },

				{'field': 'tags', 'value': 'senior', 'newValue': 'Senior,Adulto' },

				{'field': 'tags', 'value': 'sobrecito', 'newValue': 'Sobrecitos' },
				{'field': 'tags', 'value': 'sobrecitos', 'newValue': 'Sobrecitos' },
				{'field': 'tags', 'value': 'Urinario', 'newValue': 'Urinario,Urinary' },
				{'field': 'tags', 'value': 'urinary.urinario', 'newValue': 'Urinario,Urinary' },
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
			return res.status(200).json( rpta );
		} catch (error) {
			console.log(error);
			return res.status(500).json( error );
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
	async lista( req: Request, res: Response ) {
		try {
			const rpta = await articulo.find();
			res.status(200).json(rpta);
		} catch (error) {
			res.status(error.status).json(error);
		}
	}

	async searchArticulos ( req: Request, res: Response ) {
		try {
			const { search } = req.params;
			let Articulo = {};
			if ( search && search.length > 0) {
				Articulo['$add'] = articuloSanitizeString(search);
			}
			const qry = { Articulo, Producto:{}, Sort: {'fullName': 1 } }
			const rpta = await readArticulos(qry);
			res.status(200).json(rpta);
		} catch (error) {
			res.status(403).json(error);
		}
	}

	async findArticulos ( req: Request, res: Response ) {
		try {
			const qry = req.body;
			const rpta = await readArticulos(qry);
			res.status(200).json(rpta);
		} catch (error) {
			res.status(403).json(error);
		}
	}

	async searchProductos ( req: Request, res: Response ) {
		try {
			const { search } = req.params;
			let Articulo = {};
			if ( search && search.length > 0) {
				Articulo['$and'] = articuloSanitizeString(search);
			}
			const qry = { Articulo, Producto:{}, Sort: { 'fabricante': 1, 'marca': 1, 'rubro': 1, 'linea': 1, 'especie': 1, 'edad': 1, 'raza': 1, 'name': 1 } }
			const rpta = await readProductos(qry,saleProduct);
			res.status(200).json(rpta);
		} catch (error) {
			console.log(error)
			res.status(403).json(error);
		}
	}

	async findProductos ( req: Request, res: Response ) {
		try {
			const qry = req.body;
//			console.log('Entra qry', qry);
			const ret = await articuloSanitize(qry);
			console.log('ret',ret)
			qry.Articulo = { _id: { $in: [ret.lista]}};
			qry.Articulo =  ret.Articulo;
			const rpta = await readProductos(qry,saleProduct);
			res.status(200).json(rpta);
		} catch (error) {
			res.status(408).json(error);
		}
	}

	async findProductosData ( req: Request, res: Response ) {
		try {
			const qry = req.body;
			console.log('Entra qry', qry);
			//const values = req.body.searchItem.split(' ').map(val => 
			//		{
			//			const tiene = new RegExp(val,'i');
			//			console.log(tiene);
			//			return { $or: [ 
			//				{fabricante: {$regex: tiene}},
			//				{marca: {$regex: tiene}}, 
			//				{name: {$regex: tiene}}, 
			//				{rubro: {$regex: tiene}}, 
			//				{linea: {$regex: tiene}}, 
			//				{edad: {$regex: tiene}}, 
			//				{especie: {$regex: tiene}}, 
			//				{raza: {$regex: tiene}}, 
			//				{tags:{$regex: tiene}}
			//			] }
			//		});
			//const vfb = req.body.searchItem.split(' ').map(val => 
			//	{
			//		return val;
			//		//return new RegExp(val,'i');
			//	}
			//);
			//const artList = await articulo.aggregate([
			//	{ $match: { $or: values } },
			//	{ $addFields: 
			//		{
			//			full_name: art_full_name_template,
			//			/*
			//			finalTotal: {
			//				$add: [ 
			//					{ $cond: [{ $in: ["$fabricante", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$marca", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$name", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$rubro", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$linea", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$edad", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$especie", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$raza", vfb ] },1,0]},
			//					{ $cond: [{ $in: ["$tags", vfb ] },1,0]},
			//					 
			//				]  
			//			}
			//			*/
			//		}
			//	}
			//
			//	//{$sort: { marca: 1, name:1 }},
			//	//{$project: {_id:1}}
			//]);
//		//	console.log(artList);
			////artList.map( e => new ObjectID(e._id));
			////console.log(artList.map( e => new ObjectID(e._id)));


			const ret = await articuloSanitize(qry);
			qry.Articulo = ret.Articulo;//{_id: {$in: artList.map( e => new ObjectID(e._id))}};
			//qry.Extra = ret.Extra;
			const rpta = await readProductos(qry,dataProduct({}));
			res.status(200).json(rpta);
		} catch (error) {
			console.log(error)
			res.status(408).json(error);
		}
	}
	async findPublicProductosData ( req: Request, res: Response ) {
		try {
			const qry = req.body;
			console.log('Entra qry', qry);
			const ret = await articuloSanitize(qry);
			qry.Articulo = ret.Articulo;
			qry.Extra = ret.Extra;
			const rpta = await readProductos(qry,dataProduct({hidden:{
				"compra": 0,
				"reposicion": 0,
				"promedio": 0,
				//	"precioref": 0,
				"stockMin": 0,
				"margen": 0,
				"art_margen": 0,
				"tipo": 0,
				'ins': 0,
				'cerrado':0,
				'parte':0,
				'sub.compra':0,
				'sub.reposicion':0
			}}));
			res.status(200).json(rpta);
		} catch (error) {
			res.json(error);
		}
	}

	async fulldata ( req: Request, res: Response ) {
		try {

			const qry = {
				Articulo: {}
				,Extra: {}
			};
			console.log('Entra qry', qry);
			const rpta = await readProductos(qry,dataProduct({}));
			res.status(200).json(rpta);
		} catch (error) {
			res.json(error);
		}
	}

	async test ( req: Request, res: Response ) {
		try {
			const { search } = req.params;
			const txtArr = search.split(' ').filter( val => {
				if (val.length > 0) return val;
			}).map( value => { return value; });

			//const contador = txtArr.map(val => {
			//	const tiene = new RegExp(val,'i');
			//	return { $cond: [ { $regexMatch: { input: "$full_text", regex: tiene } },1,0]} 
			//});
			//console.log(contador);
			//
			//const values = txtArr.map(async (val) => {
			//	const tiene = new RegExp(val, 'i');
			//	return await articulo.aggregate([
			//		{
			//			$match: {
			//				$or: [
			//					{ fabricante: { $regex: tiene } },
			//					{ marca: { $regex: tiene } },
			//					{ name: { $regex: tiene } },
			//					{ rubro: { $regex: tiene } },
			//					{ linea: { $regex: tiene } },
			//					{ edad: { $regex: tiene } },
			//					{ especie: { $regex: tiene } },
			//					{ raza: { $regex: tiene } },
			//					{ tags: { $regex: tiene } }
			//				]
			//			}
			//		},
			//		{ $addFields: 
			//			{
			//				full_text: { $concat: [
			//					'$fabricante', ' ',
			//					'$marca', ' ',
			//					'$name', ' ',
			//					'$rubro', ' ',
			//					'$linea', ' ',
			//					'$edad', ' ',
			//					'$especie', ' ',
			//					'$raza', ' ',
			//					'$tags', ' '
			//				]},
			//				fullName: art_full_name_template
			//			}
			//		},
			//		{ $addFields: 
			//			{
			//				finalTotal: {
			//					$add: contador
			//				}
			//			}
			//		},
			//		{ 
			//			$match: { 
			//				//full_text: { $in: vfb },
			//				finalTotal: { $gt: 0 }
			//			}
			//		},
			//		{$sort: { finalTotal: -1, fullName: 1 }},
			//	]);
			//});
			//const pepe = Promise.all(values).then( resultado => {
			//	let data:any[] = [];
			//	for (let i = 0; i < resultado.length; i++) {
			//		data = data.concat(resultado[i]);
			//	}
//
			//	res.status(200).json(data);
			//})

			//const vfb = txtArr.map(val => 
			//	{
			//		return new RegExp(val,'i');
			//	}
			//);
			//
			//const contador = txtArr.map(val => {
			//	const tiene = new RegExp(val,'i');
			//	return { $cond: [ { $regexMatch: { input: "$full_text", regex: tiene } },1,0]} 
			//});
			//
			//const artList = await articulo.aggregate([
			//	{ $match: { $and: values 
			//			//$or: [
			//			//	{"fabricante": { $in:  vfb  }},
			//			//	{"marca": { $in:  vfb  }},
			//			//	{"name": { $in:  vfb  }},
			//			//	//{"rubro": { $in:  vfb  }},
			//			//	//{"linea": { $in:  vfb  }},
			//			//	//{"edad": { $in:  vfb  }},
			//			//	//{"especie": { $in:  vfb  }},
			//			//	//{"raza": { $in:  vfb  }},
			//			//	//{"tags": { $in:  vfb  }}
			//			//]
			//		} 
			//	},
			//	{ $addFields: 
			//		{
			//			full_text: { $concat: [
			//				'$fabricante', ' ',
			//				'$marca', ' ',
			//				'$name', ' ',
			//				'$rubro', ' ',
			//				'$linea', ' ',
			//				'$edad', ' ',
			//				'$especie', ' ',
			//				'$raza', ' ',
			//				'$tags', ' '
			//			]},
			//			fullName: art_full_name_template
			//		}
			//	},
			//	{ $addFields: 
			//		{
			//			finalTotal: {
			//				$add: contador
			//			}
			//		}
			//	},
			//	{ $match: { 
			//			//full_text: { $in: vfb },
			//			finalTotal: { $gt: 0 }
			//		}
			//	},
			//	{$sort: { finalTotal: -1, fullName: 1 }},
			//]);

			const qry:any = {};
			qry.searchItem = search;
			const ret = await articuloSanitize(qry);
			qry.Articulo = ret.Articulo;
			qry.Extra = ret.Extra;

			//qry.Articulo = {_id: {$in: artList.map( e => new ObjectID(e._id))}};
			//qry.Extra = ret.Extra;
			const rpta = await readProductos(qry,dataProduct({}));

			res.status(200).json(rpta);
		} catch (error) {
			console.log(error);
			res.status(403).json(error);
		}
	}

	async updateFullData( req: Request, res: Response ){
		try {
			if(typeof(req.body.detalles) !== "string" && req.body.detalles.length === 0) req.body.detalles = ""
			const artReg = {
				_id: new ObjectID( req.body._id ),
				fabricante: req.body.fabricante,
				marca: req.body.marca,
				rubro: req.body.rubro,
				linea: req.body.linea,
				especie: req.body.especie,
				edad: req.body.edad,
				raza: req.body.raza,
				name: req.body.name,
				d_fabricante: req.body.d_fabricante,
				d_marca: req.body.d_marca,
				d_rubro: req.body.d_rubro,
				d_linea: req.body.d_linea,
				d_especie: req.body.d_especie,
				d_edad: req.body.d_edad,
				d_raza: req.body.d_raza,
				private_web: req.body.private_web,
				image: req.body.image,
				url: req.body.url,
				iva: req.body.iva,
				margen: req.body.margen,
				tags: req.body.tags,
				formula: req.body.formula,
				detalles: req.body.detalles,
				beneficios: req.body.beneficios
			}
			const prod_ids = [];
			const prod_regs = [];
			const prod_saved = [];

			for (let i = 0; i < req.body.productos.length; i++) {
				const e = req.body.productos[i];
				e._id = new ObjectID(e._id);
				e.parent = (e.parent === null ? null : new ObjectID(e.parent));
				prod_ids.push(e._id);
				prod_regs.push({
					_id: e._id
					,articulo: artReg._id
					,parent: e.parent
					,name: e.name
					,contiene: e.contiene
					,unidad: e.unidad
					,precio: e.precio
					,precio_desde: e.precio_desde
					,precio_hasta: e.precio_hasta
					,compra: e.compra
					,reposicion: e.reposicion
					,pesable: e.pesable
					,servicio: e.servicio
					,pVenta: e.pVenta
					,pCompra: e.pCompra
					,codigo: e.codigo
					,plu: e.plu
					,image: e.image
					,stock: e.stock
					,stockMin: e.stockMin
					,stockMax: e.stockMax
					,iva: e.iva
					,margen: e.margen
					,tags: e.tags
				})
			}
			const art_rpta = await articulo.updateOne( {_id: artReg._id}, { $set :  artReg  }, { upsert: true });
			console.log(artReg);
			console.log(art_rpta);

			const del_regs = await producto.deleteMany({articulo: artReg._id, _id: { $nin: prod_ids } })
			console.log(del_regs);
			for (let i = 0; i < prod_regs.length; i++) {
				const e = prod_regs[i];
				console.log(e);
				prod_saved.push( await producto.updateOne( {_id: e._id}, { $set :  e  }, { upsert: true }));
			}
			const qry = {Articulo: { _id: artReg._id } };
			const rpta = await readProductos(qry,dataProduct({}));

			res.status(200).json({ rpta: rpta[0], del_regs, artReg, prod_regs, prod_saved });

		} catch (error) {
			console.log(error);
			res.status(403).json({ error });
		}
	}

	async textSearch( req: Request, res: Response ){
		const {search} = req.params;
		const qry:any = {};
		qry.searchItem = search;
		const ret = await articuloSanitize(qry);// = function (search: string, artQry?: any) {
		qry.Articulo = ret.Articulo;
		const rpta = await readProductos(qry,dataProduct({}));
		res.status(200).json(rpta);
	}

}

export const articuloCtrl = new ArticuloControler();