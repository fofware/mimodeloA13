import { Request, Response, Router } from 'express';
import producto, { IProducto } from '../models/producto';
import { ObjectID } from 'bson'
import passport from "passport";
import articulos from '../models/articulos'
import { articuloCtrl, articuloSanitize, articuloSanitizeString, articuloTextSearch, art_name_template, dataProduct, readArticulos, readProductos, saleProduct } from './articuloControler';
import { qryProductosProcess, readParent } from '../common/productosCommon';
import { decimales, round } from '../common/utils';
import {Strategy, ExtractJwt, StrategyOptions} from 'passport-jwt';
import ProductoName from '../models/productoname'

//import productoIdx from '../models/productoIdx';
const ahora = new Date();
const zeroTime = new Date(0);
const baseCalculo = 'reposicion';

export const producto_ins_template = () => {
	return 				{
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
								// Este es un producto que se compra por caja 
								// que contiene producto que se pueden vender o no
								// de forma separada
								// 
								//{ $eq: ["$$pVenta", true] },
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
					_id: 1, parent: 1, name: 1, contiene: 1, unidad: 1, precio: 1, compra: 1, reposicion: 1, margen:1, stock: 1, image: 1, strContiene: { $toString: '$contiene' }
				}
				//$project: { name: 1, contiene: 1, unidad: 1, _id: 0 } 
			}

		],
		as: "ins"
	}

}
export const producto_parte_template = () => {
	return 				{
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
								//{ $eq: ["$$pVenta", true] },
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
				$project: { _id: 1, parent: 1, name: 1, contiene: 1, unidad: 1, precio: 1, compra: 1, reposicion: 1, margen:1, stock: 1, image: 1, strContiene: { $toString: '$contiene' } }
			}
		],
		as: "parte"
	}

}
export const producto_cerrado_template = () => {
	return 				{
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
								//{ $eq: ["$$pVenta", true] },
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
				$project: { _id: 1, parent: 1, name: 1, contiene: 1, unidad: 1, precio: 1, compra: 1, reposicion: 1, margen:1, stock: 1, image: 1, strContiene: { $toString: '$contiene' } }
			}
		],
		as: "cerrado"
	}

}

export const precioLista = (indice) => {
	return { 
		$cond: [ { $and: ['$precio', {$lte: [ahora,'$precio_hasta']},{$gte: [ahora, '$precio_desde']}]}, 
			{ $ceil:
				{
					$multiply: [{
						$ceil: {
							$divide: [{
								$ceil:
								{
									$cond: [{ $eq: ['$count_parte', 0] },
									{ $multiply: [{ $divide: ['$precio', '$parte.contiene'] }, indice] },
									{
										$cond:
											[{ $eq: ['$count_cerrado', 0] },
											{ $multiply: [{ $divide: ['$cerrado.precio', '$cerrado.contiene'] }, indice] },
											{ $multiply: [ '$precio', indice] }
											]
									}]
								}
							}, 10]
						}
					}, 10]
				}
			},
			{ $ceil:
				{
					$multiply: [{
						$ceil: {
							$divide: [{
								$ceil:
								{
									$cond: [{ $eq: ['$count_parte', 0] },
									{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }, indice] },
									{
										$cond:
											[{ $eq: ['$count_cerrado', 0] },
											{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }, indice] },
											{ $multiply: [{ $add: ['$margen', 100] }, 0.01, `$${baseCalculo}`, indice] }
											]
									}]
								}
							}, 10]
						}
					}, 10]
				}
			}				
		]
	}
}
export const compra = () => {
	return {
		$cond:[	{ $eq: ['$count_parte', 0] },
						{ $divide: ['$parte.compra', '$parte.contiene'] },
						{	$cond:[	{ $eq: ['$count_cerrado', 0] },
											{ $divide: ['$cerrado.compra', '$cerrado.contiene']},
											'$compra'
										]
						}
					]
		}
}

export const producto_fullName_template = () => {
	return {
		$trim:{ 
			input: { 
				$concat: [
					'$art_fullName', 
					{ $cond: [{ $eq: ['$name', '']}, '', ' ']},
					'$name',
					{ $cond: [{ $eq: ['$strContiene', '']}, '', ' ']},
					'$strContiene',
					{ $cond: [{ $eq: ['$unidad', '']}, '', ' ']},
					'$unidad',
					{ $cond: [{ $eq: ['$sname', '']}, '', ' ']},
					'$sname',
					{ $cond: [{ $eq: ['$sStrContiene', '']}, '', ' ']},
					'$sStrContiene',
					{ $cond: [{ $eq: ['$sunidad', '']}, '', ' ']},
					'$sunidad'
				]
			}
		}
	}
}

export const calculaPrecio = (coeficienteDescuento,margenMinimo,pesable) => {
	const incrementoMinimo = (margenMinimo+100)/100;
	if(pesable)
		return {
			$cond: [
				{ $eq: ['$pesable', true] },
				{
					$ceil: {
						$ceil:
						{
							$cond: [{ $eq: ['$count_parte', 0] },
							{
								$cond: [{ $gt: [{ $multiply: ['$margen', coeficienteDescuento] }, '$parte.margen'] },
								{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] },
								{ $multiply: [{ $add: ['$parte.margen', 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] }
								]
							},
							{
								$cond:
									[{ $eq: ['$count_cerrado', 0] },
									{
										$cond: [{ $gt: [{ $multiply: ['$margen', coeficienteDescuento] }, '$cerrado.margen'] },
										{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }] },
										{ $multiply: [{ $add: ['$cerrado.margen', 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }] }
										]
									},
									{
										$cond: [{ $gt: [{ $multiply: ['$margen', coeficienteDescuento] }, '$margen'] },
										{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, `$${baseCalculo}`] },
										{ $multiply: [{ $add: ['$margen', 100] }, 0.01, `$${baseCalculo}`] }
										]
									}
									]
							}]
						}
					}
				}
				, {
					$multiply: [{
						$ceil: {
							$divide: [{
								$ceil:
								{
									$cond: [{ $eq: ['$count_parte', 0] },
									{
										$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, '$parte.margen'] },
										{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] },
										{ $multiply: [{ $add: ['$parte.margen', 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] }
										]
									},
									{
										$cond: [{ $eq: ['$count_cerrado', 0] },
											{
												$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, '$cerrado.margen'] },
												{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }] },
												{ $multiply: [{ $add: ['$cerrado.margen', 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }] }
												]
											},
											{
											/*
													$cond: [{ $eq: ['$count_ins', 0] },
													{
														$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, '$margen'] },
														{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, '$compra' ] },
														{ $multiply: [incrementoMinimo, '$compra'] }
														]
													},
													{
											*/
														$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, margenMinimo] },
														{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, `$${baseCalculo}`] },
														{ $multiply: [incrementoMinimo, `$${baseCalculo}`] }
														]
													}]
											//}]
									}]
								}
							}, 10]
						}
					}, 10]
				}
			]
		}
	else
		return {
			$cond: [{ $eq: ['$pesable', true] },
			{
				$ceil: {
					$ceil:
					{
						$cond: [{ $eq: ['$count_parte', 0] },
						{ $multiply: [{ $add: ['$parte.margen', 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] },
						{ $cond:[{ $eq: ['$count_cerrado', 0] },
								{ $multiply: [{ $add: ['$cerrado.margen', 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }] },
								//{
								//	$cond:[{ $eq: ['$count_ins', 0] },
								//		{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: ['$compra', '$contiene'] }] },
										{ $multiply: [{ $add: ['$margen', 100] }, 0.01, `$${baseCalculo}`] }
								//	]
								//}
								]
						}]
					}
				}
			},
			{
				$multiply: [{
					$ceil: {
						$divide: [{
							$ceil:
							{
								$cond: [{ $eq: ['$count_parte', 0] },
								{
									$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, '$parte.margen'] },
									{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] },
									{ $multiply: [{ $add: ['$parte.margen', 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] }
									]
								},
								{
									$cond: [{ $eq: ['$count_cerrado', 0] },
										{
											$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, '$cerrado.margen'] },
											{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }] },
											{ $multiply: [{ $add: ['$cerrado.margen', 100] }, 0.01, { $divide: [`$cerrado.${baseCalculo}`, '$cerrado.contiene'] }] }
											]
										},
										{
											$cond: [{ $eq: ['$count_ins', 0] },
												{
													$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, '$margen'] },
													{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, { $divide: [`$${baseCalculo}`, '$contiene'] }] },
													{ $multiply: [incrementoMinimo, `$${baseCalculo}`] }
													]
												},
												{
													$cond: [{ $gte: [{ $multiply: ['$margen', coeficienteDescuento] }, margenMinimo] },
													{ $multiply: [{ $add: [{ $multiply: ['$margen', coeficienteDescuento] }, 100] }, 0.01, `$${baseCalculo}`] },
													{ $multiply: [incrementoMinimo, `$${baseCalculo}`] }
													]
												}]
										}]
								}]
							}
						}, 10]
					}
				}, 10]
			}
		]
	}

}

export const referencia = (Decimales) => {
	return {
		$round: [
			{
				$cond: [{ $eq: ['$count_parte', 0] },
				//{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: ['$parte.compra', '$parte.contiene'] }] },
				calculaPrecio(1,15,true),
				{
					$cond: [{ $eq: ['$count_cerrado', 0] },
						{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, `$cerrado.${baseCalculo}`] }, { $cond: [{ $eq: ['$cerrado.contiene', 0] }, 1, { $multiply: ['$cerrado.contiene', '$contiene'] }] }] },
						{ $divide: [calculaPrecio(1,15,true),{ $cond: [{ $eq: ['$contiene', 0] }, 1, '$contiene'] }]}
						//{
						//	$cond: [{ $eq: ['$count_ins', 0] },
						//	{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$compra'] }, { $cond: [{ $eq: ['$contiene', 0] }, '$contiene', { $multiply: ['$contiene', '$ins.contiene'] }] }] },
						//	{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, '$compra'] }, { $cond: [{ $eq: ['$contiene', 0] }, 1, '$contiene'] }] }
						//	]
						//}
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
								{ $multiply: [{ $add: ['$margen', 100] }, 0.01, { $divide: [`$parte.${baseCalculo}`, '$parte.contiene'] }] },
								{
									$cond: [{ $eq: ['$count_cerrado', 0] },
									{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, `$cerrado.${baseCalculo}`] }, { $cond: [{ $eq: ['$cerrado.contiene', 0] }, 1, { $multiply: ['$cerrado.contiene', '$contiene'] }] }] },
									{
										$cond: [{ $eq: ['$count_ins', 0] },
										{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, `$${baseCalculo}`] }, { $cond: [{ $eq: ['$ins.contiene', 0] }, '$contiene', { $multiply: ['$contiene', '$ins.contiene'] }] }] },
										{ $divide: [{ $multiply: [{ $add: ['$margen', 100] }, 0.01, `$${baseCalculo}`] }, { $cond: [{ $eq: ['$contiene', 0] }, 1, '$contiene'] }] }
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
					Decimales

				]
			}
		]
	}

}

// TODO: #1 hay que limpiar el codigo en desuuso comentado de este archivo y crear las plantillas comunes para artículos y productos. 
// buscar todo lo que se pueda unificar con articulos

const producto_base = {
	"_id": 1,
	"parent": 1,
	"name": 1,
	"contiene": { $ifNull: [ '$contiene', 1 ] },
	"strContiene": {$toString: '$contiene'},
	"unidad": 1,
	"precio": 1,
	"compra": 1,
	"reposicion": { $ifNull: ['$reposicion', '$compra'] },
	"precio_desde":{ $ifNull: ['$precio_desde', zeroTime] },
	"precio_hasta":{ $ifNull: ['$precio_hasta', ahora] },
	"ahora": ahora,
	"compra_fecha":1,
	"reposicion_fecha":1,
	"pesable": 1,
	"servicio": 1,
	"pVenta": 1,
	"pCompra": 1,
	'codigo': { $ifNull: [ '$codigo', '' ] },
	'plu': { $ifNull: [ '$plu', '' ] },
	"stock": 1,
	"stockMin": 1,
	"iva": 1,
	"margen": 1,
	"articuloId": "$articulo"
}
const producto_precios_merge = (input:Object) => {
	const data = {
		'lista': precioLista(1.0778521857),
		//'showPrecio': calculaPrecio(1,18.5,true),
		"showPrecio": { $cond: [ { $and: ['$precio', {$lte: [ahora,'$precio_hasta']},{$gte: [ahora, '$precio_desde']}]}, '$precio', calculaPrecio(1,15,true)]}, 
		'reventa': calculaPrecio(.85,14.5,true),
		'reventa1': calculaPrecio(.43,13,true),
		'reventa2': calculaPrecio(.1556,11.5,true),
		//'showPrecio': calculaPrecio(1,22.5,true),
		//'reventa': calculaPrecio(.85,18.5,true),
		//'reventa1': calculaPrecio(.43,14.5,true),
		//'reventa2': calculaPrecio(.1556,11.5,true),
		'precio': 1,
	}
	return Object.assign(input,data)
}
const producto_sub_merge = {
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

}
const producto_to_merge = {
	"_id": 1,
	"parent": 1,
	"name": 1,
	"contiene": 1,
	"strContiene": 1,
	"unidad": 1,
	"compra": 1,
	"reposicion": 1,
	"precio": 1,
	"precio_desde":1,
	"precio_hasta":1,
	"ahora": 1,
	"compra_fecha":1,
	"reposicion_fecha":1,
	"pesable": 1,
	"servicio": 1,
	"pVenta": 1,
	"pCompra": 1,
	'codigo': 1,
	'plu': 1,
	"stock": 1,
	"stockMin": 1,
	"iva": 1,
	"margen": 1,
	"articuloId": 1,
}

export const productoFullTemplate = 				
{
	"_id": 1,
	"name": 1,
	"contiene": 1,
	"strContiene": { $cond: [{ $eq: ['$count_ins', 0] }, { $concat: ['con ', '$strContiene'] }, '$strContiene'] },
	"unidad": 1,
	"compra": 1,
	"showCompra" : compra(),
	"reposicion": 1,
	'lista': precioLista(1.0778521857),
	//"calc_precio": calculaPrecio(1,22.5,true), 
	//'showPrecio': calculaPrecio(1,22.5,true),
	//'reventa': calculaPrecio(.85,18.5,true),
	//'reventa1': calculaPrecio(.43,14.5,true),
	//'reventa2': calculaPrecio(.1556,11.5,true),
	//"calc_precio": { $cond: [ { $and: ['$precio', {$lte: [ahora,'$precio_hasta']},{$gte: [ahora, '$precio_desde']}]}, '$precio' ,calculaPrecio(1,15,true)]}, 
	"calc_precio": calculaPrecio(1,15,true), 
	"showPrecio": { $cond: [ { $and: ['$precio', {$lte: [ahora,'$precio_hasta']},{$gte: [ahora, '$precio_desde']}]}, '$precio' ,calculaPrecio(1,15,true)]}, 
	//'showPrecio': { $cond: [ '$precio', '$precio' ,calculaPrecio(1,15,true)]}, 
	'reventa': calculaPrecio(.85,14,true),
	'reventa1': calculaPrecio(.43,12,true),
	'reventa2': calculaPrecio(.1556,10,true),
	'precio': 1,
	'precio_desde': 1,
	'precio_hasta': 1,
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
	"stock": 1,
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
};

const full_project = {
	"_id": 1,
	"name": 1,
	"contiene": 1,
	"strContiene": 1,
	"unidad": 1,
	"compra": 1,
	"reposicion": 1,
	"promedio": 1,
	//"precio": { $cond: [ '$precio', '$precio', "$calc_precio"]},
	"precio": 1,
	"precio_desde":{ $ifNull: [ '$precio_desde', zeroTime] },
	"precio_hasta":{ $ifNull: [ '$precio_hasta', ahora ] },
	"calc_precio": 1, 
	"precioref": 1,
	'sub': 1,
	"pesable": 1,
	"servicio": 1,
	"pVenta": 1,
	"pCompra": 1,
	'codigo': { $ifNull: [ '$codigo', '' ] },
	'plu': { $ifNull: [ '$plu', '' ] },
	"image": 1,
	"stock":1,
	"divisor": 1,
	"scontiene": 1,
	"sname": 1,
	"sunidad": 1,
	"stockMin": 1,
	"iva": 1,
	"margen": 1,
	"articuloId": 1,
	"art_name": 1,
	"url": 1,
	"art_image": 1,
	"art_iva": 1,
	"fabricante": 1,
	"marca": 1,
	"rubro": 1,
	"linea": 1,
	"especie": 1,
	"edad": 1,
	"raza": 1,
	"d_fabricante": 1,
	"d_marca": 1,
	"d_rubro": 1,
	"d_linea": 1,
	"d_especie": 1,
	"d_edad": 1,
	"d_raza": 1,
	"tags": 1,
	"art_margen": 1,
	"tipo": 1,
	'ins': 1,
	'count_ins':1,
	'cerrado':1,
	'count_cerrado': 1,
	'parte':1,
	'count_parte': 1,
	'formula': 1,
	'detalles': 1,
	'beneficios': 1,
	'private_web': 1,
	'fullName': {
		$trim: 
		{ input: 
			{ $concat: [
				'$art_name', 
				{ $cond: [{ $eq: ['$name', '']}, '', ' ']},
				'$name',
				{ $cond: [{ $eq: ['$strContiene', '']}, '', ' ']},
				'$strContiene',
				{ $cond: [{ $eq: ['$unidad', '']}, '', ' ']},
				'$unidad',
				{ $cond: [{ $eq: ['$sname', '']}, '', ' ']},
				'$sname',
				{ $cond: [{ $eq: ['$sStrContiene', '']}, '', ' ']},
				'$sStrContiene',
				{ $cond: [{ $eq: ['$sunidad', '']}, '', ' ']},
				'$sunidad'
				]
			}
		}
	},
	"showPrecio": 1
}

export const invalidData = {
	"compra": 0,
	"reposicion": 0,
	"promedio": 0,
//	"precioref": 0,
	"stockMin": 0,
	"margen": 0,
	"art_margen": 0,
	"tipo": 0,
//	'ins': 0,
//	'cerrado':0,
//	'parte':0,
}

export const productoGetData = async function( qry: any, outProject?: any, hiddenData?: any ): Promise<IProducto[]> {
		if( !qry.Producto ) qry.Producto = {};
		if( !qry.Articulo ) qry.Articulo = {};
		if( !qry.Extra ) qry.Extra = {};
		if( !qry.showData) qry.showData = { 'noproject': 0}
		if( !qry.hiddenData) qry.hiddenData = { 'noproject': 0}
		if( !qry.Decimales) qry.Decimales = 2;
		if( !qry.Sort ) qry.Sort = { 'art_fullName': 1, 'contiene': 1, 'precio': 1 };
		const aggr = [
			{ $match: qry.Producto },
			{
				$lookup: {
					from: "articulos",
					localField: "articulo",
					foreignField: "_id",
					as: "art"
				}
			},
			{
				$unwind: "$art"
			},
			{
				$project: {
					"_id": 1,
					"parent": 1,
					"name": 1,
					"contiene": { $ifNull: [ '$contiene', 1 ] },
					"strContiene": {$toString: '$contiene'},
					"unidad": { $ifNull: ['$unidad', ''] },
					"precio": 1,
					"compra": 1,
					"reposicion": { $ifNull: [ '$reposicion', '$compra' ] },
					"ahora": ahora,
					"ahorad": { '$lte': ['$precio_desde', ahora]},
					"ahorah": { '$gte': ['$precio_hasta', ahora]},
					"ahoracomp": { '$and': [ { '$lte': ['$precio_desde', ahora]}, { '$gte': ['$precio_hasta', ahora]}]},
					"precio_desde": 1, //{ $ifNull: ['$precio_desde', zeroTime] },
					"precio_hasta": 1, //{ $ifNull: ['$precio_hasta', ahora] },
					"reposicion_fecha":1,
					"pesable": 1,
					"servicio": 1,
					"pVenta": 1,
					"pCompra": 1,
					'codigo': { $ifNull: [ '$codigo', '' ] },
					'plu': { $ifNull: [ '$plu', '' ] },
					"stock": 1,
					"stockMin": 1,
					"iva": 1,
					"margen": 1,
					"articuloId": "$articulo",
					"image": {$cond: [ '$image', '$image', '$art.image']},
					'art_name': '$art.name',
					'art_fullName': art_name_template,
					'url': '$art.url',
					'art_image': '$art.image',
					'art_iva': '$art.iva',
					'fabricante': { $ifNull: [ '$art.fabricante', '' ] },
					'marca': { $ifNull: [ '$art.marca', '' ] },
					'rubro': { $ifNull: [ '$art.rubro', '' ] },
					'linea': { $ifNull: [ '$art.linea', '' ] },
					'especie': { $ifNull: [ '$art.especie', '' ] },
					'edad': { $ifNull: [ '$art.edad', '' ] },
					'raza': { $ifNull: [ '$art.raza', '' ] },
					'd_fabricante': '$art.d_fabricante',
					'd_marca': '$art.d_marca',
					'd_rubro': '$art.d_rubro',
					'd_linea': '$art.d_linea',
					'd_especie': '$art.d_especie',
					'd_raza': '$art.d_raza',
					'd_edad': '$art.d_edad',
					'art_margen': '$art.margen',
					'private_web': { $ifNull: [ '$art.private_web', false ] },
					'formula': '$art.formula',
					'detalles': { $ifNull: [ '$art.detalles', '' ] },
					'beneficios': '$art.beneficios',
					'tags': { '$concat':['$art.tags',' ', '$tags']},
					'tipo': {
						$cond: ['$parent', 
							// Tine parent 
							1, 
							0
						]
					},
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
				$project:
				{
					"_id": 1,
					"parent": 1,
					"name": 1,
					"contiene": 1,
					"unidad": 1,
					"precio": 1,
					"compra": 1,
					"reposicion": 1,
					"precio_desde": 1,
					"precio_hasta": 1,
					"ahora": 1,
					"ahorad": 1,
					"ahorah": 1,
					"ahoracomp": 1,
					"reposicion_fecha":1,
					"pesable": 1,
					"servicio": 1,
					"pVenta": 1,
					"pCompra": 1,
					'codigo': 1,
					'plu': 1,
					"stockMin": 1,
					"iva": 1,
					"margen": 1,
					"articuloId": 1,
					"image": {$cond:[{$eq:[{ $strLenBytes: "$image" },0]},'$art_image','$image']},
					'art_name': 1,
					'art_fullName': 1,
					'url': 1,
					'art_image': 1,
					'art_iva': 1,
					'fabricante': 1,
					'marca': 1,
					'rubro': 1,
					'linea': 1,
					'especie': 1,
					'edad': 1,
					'raza': 1,
					'd_fabricante': 1,
					'd_marca': 1,
					'd_rubro': 1,
					'd_linea': 1,
					'd_especie': 1,
					'd_raza': 1,
					'd_edad': 1,
					'tags': 1,
					'art_margen': 1,
					'private_web': 1,
					'formula': 1,
					'detalles': 1,
					'beneficios': 1,
					'tipo': 1,
					'ins': 1,
					'count_ins':1,
					'cerrado':1,
					'count_cerrado': 1,
					'parte':1,
					'count_parte': 1,
					"strContiene": {$cond: [{$eq:['$count_ins',0]}, {$concat: ['con ','$strContiene']}, '$strContiene']},
					'lista': precioLista(1.0778521857),
					//'calc_precio': calculaPrecio(1,22.5,true),
					//'showPrecio': calculaPrecio(1,22.5,true),
					//'reventa': calculaPrecio(.85,18.5,true),
					//'reventa1': calculaPrecio(.43,14.5,true),
					//'reventa2': calculaPrecio(.1556,11.5,true),
					'calc_precio': calculaPrecio(1,15,true),
					//'showPrecio': calculaPrecio(1,15,true),
					//"showPrecio": { $cond: [ { $and: ['$precio', {$lte: [ahora,'$precio_hasta']}, {$gte: [ahora, '$precio_desde']}]}, '$precio', calculaPrecio(1,15,true)]}, 
					"showPrecio": { $cond: [ { $and: ['$precio', {$lte: [ahora,'$precio_hasta']}, {$gte: [ahora, '$precio_desde']}]}, '$precio', calculaPrecio(1,15,true)]}, 
					'reventa': calculaPrecio(.85,14,true),
					'reventa1': calculaPrecio(.43,12,true),
					'reventa2': calculaPrecio(.1556,10,true),
					'sub': {
						$cond: [ {$eq: ['$count_ins',0]},
							'$ins',
							{$cond: [{$eq: ['$count_parte',0]},
								'$parte',
								{$cond: [{$eq: ['$count_cerrado',0]},
									'$cerrado',
									{'name':'','strContiene':'','unidad':''}
								]}
							]}
						]
					},
					"stock":{ $floor: 
						{ $cond: [ {$eq: ['$count_parte', 0]}, 
							{ $multiply: ['$parte.stock', '$parte.contiene']}, 
							{ $cond: [ {$eq:[ '$count_cerrado', 0 ]}, 
								{ $multiply: ['$cerrado.stock', '$cerrado.contiene']},
								{ $cond: [ {$eq: ['$ins_count',0]},
									{ $cond: [ {$gte: [ '$stock', 1] }, '$stock', 0]}, 
									{ $cond: [ {$gte: [ '$stock', 1] }, '$stock', 0]} 
								]}
							]}
						]}
					},
					"divisor": { $cond: [ {$eq: ['$count_parte', 0]}, 
						'$parte.contiene', 
						{ $cond: [ {$eq:[ '$count_cerrado', 0 ]}, 
							'$cerrado.contiene', 
							{ $cond: [ {$eq: ['$ins_count',0]},
								'$ins.contiene',
								1 ] }
							]}
						]
					},
					"scontiene": { $cond: [ {$eq: ['$count_parte', 0]}, 
						'', 
						{ $cond: [ {$eq:[ '$count_cerrado', 0 ]}, 
							'', 
							{ $cond: [ {$eq: ['$count_ins',0]},
								'$ins.contiene',
								'' ] }
							]}
						]
					},
					"sStrContiene": { $cond: [ {$eq: ['$count_parte', 0]}, 
						'', 
						{ $cond: [ {$eq:[ '$count_cerrado', 0 ]}, 
							'', 
							{ $cond: [ {$eq: ['$count_ins',0]},
								'$ins.strContiene',
								'' ] }
							]}
						]
					},
					"sname": { $cond: [ {$eq: ['$count_parte', 0]}, 
						'', 
						{ $cond: [ {$eq:[ '$count_cerrado', 0 ]}, 
							'', 
							{ $cond: [ {$eq: ['$count_ins',0]},
								'$ins.name',
								'' ] }
							]}
						]
					},
					"sunidad": { $cond: [ {$eq: ['$count_parte', 0]}, 
						'', 
						{ $cond: [ {$eq:[ '$count_cerrado', 0 ]}, 
							'', 
							{ $cond: [ {$eq: ['$count_ins',0]},
								'$ins.unidad',
								'' ] }
							]}
						]
					},
				}
			},
			{ 
				$project: {
					"_id": 1,
					"parent": 1,
					"name": 1,
					"contiene": 1,
					"precio": 1,
					"compra": 1,
					"reposicion": 1,
					"precio_desde": 1,
					"precio_hasta": 1,
					"ahora": 1,
					"ahorad": 1,
					"ahorah": 1,
					"ahoracomp": 1,
					"reposicion_fecha":1,
					"pesable": 1,
					"servicio": 1,
					"pVenta": 1,
					"pCompra": 1,
					'codigo': 1,
					'plu': 1,
					"stockMin": 1,
					"iva": 1,
					"margen": 1,
					"articuloId": 1,
					"image": 1,
					'art_name': 1,
					'art_fullName': 1,
					'url': 1,
					'art_image': 1,
					'art_iva': 1,
					'fabricante': 1,
					'marca': 1,
					'rubro': 1,
					'linea': 1,
					'especie': 1,
					'edad': 1,
					'raza': 1,
					'd_fabricante': 1,
					'd_marca': 1,
					'd_rubro': 1,
					'd_linea': 1,
					'd_especie': 1,
					'd_raza': 1,
					'd_edad': 1,
					'tags': 1,
					'art_margen': 1,
					'private_web': 1,
					'formula': 1,
					'detalles': 1,
					'beneficios': 1,
					'tipo': 1,
					'ins': 1,
					'count_ins':1,
					'cerrado':1,
					'count_cerrado': 1,
					'parte':1,
					'count_parte': 1,
					"strContiene": {$cond: [{$eq:['$count_ins',0]}, {$concat: ['con ','$strContiene']}, '$strContiene']},
					'lista': 1,
					'calc_precio': 1,
					"showPrecio": 1, 
					'reventa': { $cond: [{$lt:['$reventa','$showPrecio']},'$reventa','$showPrecio']},
					'reventa1': { $cond: [{$lt:['$reventa1','$showPrecio']},'$reventa1','$showPrecio']},
					'reventa2': { $cond: [{$lt:['$reventa2','$showPrecio']},'$reventa2','$showPrecio']},
					"oferta": {$lt:['$showPrecio','$calc_precio']}, 
					'precioref': {
						$round: [
							{ $divide: ['$showPrecio', '$contiene' ] },
							qry.Decimales
						]
					},//referencia(qry.Decimales),
					'sub': 1,
					"stock":1,
					"divisor": 1,
					"scontiene": 1,
					"sStrContiene": 1,
					"sname": 1,
					"sunidad": 1,
					'fullName': producto_fullName_template(),
					'unidad': { 
						$cond: [
							{$eq:['$unidad','']},
							{
								$trim:{
									input: {
										$concat: [
											{ $cond: [{ $eq: ['$sname', '']}, '', ' ']},
											'$sname',
											{ $cond: [{ $eq: ['$sStrContiene', '']}, '', ' ']},
											'$sStrContiene',
											{ $cond: [{ $eq: ['$sunidad', '']}, '', ' ']},
											'$sunidad'
										]
									}
								}
							},
							'$unidad'
						]
					},
					'prodName': {
						$trim:{ 
							input: { 
								$concat: [
									'$name',
									{ $cond: [{ $eq: ['$strContiene', '']}, '', ' ']},
									'$strContiene',
									{ $cond: [{ $eq: ['$unidad', '']}, '', ' ']},
									'$unidad',
									{ $cond: [{ $eq: ['$sname', '']}, '', ' ']},
									'$sname',
									{ $cond: [{ $eq: ['$sStrContiene', '']}, '', ' ']},
									'$sStrContiene',
									{ $cond: [{ $eq: ['$sunidad', '']}, '', ' ']},
									'$sunidad'
								]
							}
						}
					}
				}
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
	
		];
		let array:any;
		if (qry.limit){
			//console.log(qry.Producto);
			const count = await producto.find(qry.Producto).count();
			//const all = await producto.aggregate(aggr);
			//const count = all.length;
			const offset = qry.offset ? qry.offset : 0;
			let nextOffset = offset + qry.limit;
			if (nextOffset > count) nextOffset = count+1;
			//const count = await producto.aggregate(aggr).count('_id');
			//console.log(count);			 
			array = { data: await producto.aggregate(aggr).skip(offset).limit(qry.limit), count, offset, nextOffset };
		} else {
			array = { data: await producto.aggregate(aggr) };
		}
		
		//console.log(qry.Sort)
		return array;
	} 
	
class ProductoControler {

	public router: Router = Router();
	constructor() {
		this.config();
	}

	config() {
		this.router.get('/productos/lista', this.lista);
		this.router.get('/productos/list', this.list);

		this.router.post('/productos/list', this.list);

		this.router.get('/producto/:id', this.leer );

		this.router.get('/producto/marca/:id', this.marca );

		this.router.post('/producto', passport.authenticate('jwt', {session:false}), this.add);
		this.router.post('/producto/import', passport.authenticate('jwt', {session:false}), this.import);
		this.router.delete('/producto/:id', passport.authenticate('jwt', {session:false}), this.delete);
		//		this.router.put('/productos', passport.authenticate('jwt', {session:false}), this.update);
		this.router.put('/producto/:id', passport.authenticate('jwt', {session:false}), this.modifica);
		this.router.post('/productos/imany', passport.authenticate('jwt', {session:false}), this.update);

		// todo lo de abajo parece que es para borrar 
		/*
		this.router.get('/articulo/:id/productos', this.listado);
		this.router.delete('/articulo/:id/productos', this.deleteMany);
		this.router.put('/articulo/:id/productos', this.update);

		this.router.post('/productos/buscar', this.buscar)
		*/
		this.router.get('/productos/toprovlista', this.toprovlista);
		this.router.get('/productos/search/:search', this.search);
		this.router.get('/productos/test', this.test);
		this.router.get('/productos/fb', this.fb);
		this.router.get('/productos/fulldata', this.fulldataG);
		this.router.get('/productos/textsearch', this.textsearch);
		this.router.post('/productos/fulldata', this.fulldataP);
		//this.router.get('/productos/textlink/:search', this.textFulldata);
		//this.router.get('/productos/crealista', this.creaLista);
	}

	public index(req: Request, res: Response) {
		console.log(req.user);
		res.send('Productos');
	}

	async marca(req: Request, res: Response) {
		console.log(req.user)
		const { id } = req.params;
		const artList = await readArticulos({ Articulo: { marca: id,  }, Project: {'_id': 1}, Sort: {'_id': 1} });
		for (let index = 0; index < artList.length; index++) {
			artList[index] = new ObjectID(artList[index]._id);
		}
//		console.log(artList);
		const qry = { Producto: {'articulo' : { '$in': artList }, pCompra: true }};
		const readData: any = await productoGetData(qry);
		res.status(200).json(readData)
	}
	async lista(req: Request, res: Response) {
		const retData = await producto.find();
		res.status(200).json(retData);
	}

	async list(req: Request, res: Response) {
		//const { id } = req.params;
		let qry:any = req.body;
		//console.log("Llega Qry",qry)
		let myMatch: any;
		let artList: any[] = [];

		const ret:any = await articuloSanitize(qry);
		artList = ret.lista;
		console.log('ArtList 687',artList);
		for (let index = 0; index < artList.length; index++) {
			artList[index] = new ObjectID(artList[index]._id);
		}
		if (artList.length){
			qry.Producto['articulo'] = { '$in': artList };
			qry.Extra = Object.assign(qry.Extra, ret.Extra);
		}
		console.log(qry);
		const readData: any = await productoGetData(qry);
		res.status(200).json(readData)
	}

	async textsearch(req: Request, res: Response){
		let searchItem:any = req.query.searchItem;
		const st = new Date().getTime();
		const artFlds = ['fabricante', 'marca', 'rubro', 'linea', 'especie', 'edad', 'raza', 'tags', 'fullName'];
		let filter = [];
		searchItem = searchItem.replace(/  /g, ' ');
		const searcharray: any[] = searchItem.trim().split(' ');
		let e = [];
		let lista = [];
		if (searcharray.length > 0){
			const v = [];
			const regStr = [];
			//for (let n = 0; n < artFlds.length; n++) {
			//	const fld = artFlds[n];
			//	filter[fld] ={}
			//	filter[fld]['$or']=[];
			//	for (let i = 0; i < searcharray.length; i++) {
			//		const str = searcharray[i];
			//		filter[fld]['$or'].push( new RegExp( str, 'i' ));
			//	}
			//}	
			for (let i = 0; i < searcharray.length; i++) {
				const str = searcharray[i];
				const v = [];
				for (let n = 0; n < artFlds.length; n++) {
					const fld = artFlds[n];
					const o = {};
					o[fld] = new RegExp( str, 'i' );
					v.push(o);
				}
				filter['$or'] = v;


				//console.log(v)
				//if( i > 0 ) Articulo['_id'] = {'$in': lista};
				//console.log(Articulo);
				//const slista = await articulo.aggregate([{ '$match': Articulo },{'$project': {'_id': 1}}]);
				//console.log(slista.length);
				//if (slista.length){
				//	lista = slista;
				//	for (let index = 0; index < lista.length; index++) {
				//		lista[index] = new ObjectID(lista[index]._id);
				//	}
				//}
				//else {
				//	console.log(str)
				//}
			}
		}
		console.log(filter);
		const data = await ProductoName.find(
			{ $text: { $search: `${searchItem}` } },
			{ score: { $meta: "textScore" }}
		).sort({score: { $meta: "textScore" }});
		//const data = await ProductoName.find(
		//	{ '$or': filter },
		//).sort({score: { $meta: "textScore" }});
		const et = new Date().getTime();
		const retData = {
			'srv_secconds': et-st,
			data
		}
		res.status(200).json(retData);
	}
	async fulldataG(req: Request, res: Response) {
		const searchItem = req.query.searchItem;
		const limit = req.query.limit ? parseInt(`${req.query.limit}`) : 50;
		const offset = req.query.offset ? parseInt(`${req.query.offset}`) : 0;
		console.log("query", req.query.limit);
		console.log("params", req.params);

		const qry = {
			limit,
			offset,
			Producto:{
				//pVenta: true
				//reposicion: {'$gt': 0}
			},
			Extra:{ 
				//showPrecio: {'$gt': 0}
			}
		}
		const st = new Date().getTime();
		const ret = await articuloSanitize({searchItem: searchItem });
		if(ret.lista.length)
			qry['Producto']['articulo'] = { '$in': ret.lista };
		console.log(qry);
		const readData: any = await productoGetData(qry);
		//for (let i = 0; i < readData.data.length; i++) {
		//	try {
		//		const e = readData.data[i];
		//		const newReg = await ProductoName.updateOne({ _id: e._id },   // Query parameter
		//			{ $set: e }, 
		//			{ upsert: true }    // Options
		//	 )
		//	} catch (error) {
		//		console.log(error);				
		//	}
		//}
		//const readData: any = await productoGetData({Producto:{pVenta: true},Extra:{ showPrecio: {$gt: 0}}  });
		//const readData: any = await productoGetData({});

		const et = new Date().getTime();
		readData['srv_secconds'] = et-st;
		res.status(200).json(readData);
	}

	async fulldataP(req: Request, res: Response) {
		let qry:any = req.body;

		let myMatch: any;
		let artList: any[] = [];

		const ret:any = await articuloSanitize(qry);
		artList = ret.lista;
		for (let index = 0; index < artList.length; index++) {
			artList[index] = new ObjectID(artList[index]._id);
		}
		if (artList.length){
			qry.Producto['articulo'] = { '$in': artList };
			qry.Extra = Object.assign(qry.Extra, ret.Extra);
		}

		console.log(qry)
		const readData: any = await productoGetData(qry);
		res.status(200).json(readData)
	}


	async toprovlista(req: Request, res: Response) {
		/*
			*/
		try {
			const array:any = await producto.aggregate(
				[	{
					$match: {pCompra: true, pesable : { $not: { $eq: true } }}
				}
				,{
					$lookup: {
						from: "articulos",
						localField: "articulo",    // field in the orders collection
						foreignField: "_id",  // field in the items collection
						as: "articulo"
				 }
				}
				,{
					$lookup: {
					from: "productos",
					localField: "parent",    // field in the orders collection
					foreignField: "_id",  // field in the items collection
					as: "subprod"
			 		}
				}
				,{
					$unwind: {
						path: '$articulo',
						includeArrayIndex: 'count_articulos',
						preserveNullAndEmptyArrays: true
					}				
				}
				,{
					$unwind: {
						path: '$subprod',
						includeArrayIndex: 'count_subprod',
						preserveNullAndEmptyArrays: true
					}				
				}

			]);
			res.status(200).json(array)
		} catch (error) {
			res.status(403).json(error)
		}
	}
	async test(req: Request, res: Response) {
//		const array:any = await productoGetData({});
		//const qry = { articulo: '' };
		//const qry = { 'pesable': {'$ne': true}, 'pCompra': true, { '$lte': [ '$reposicion', 'compra' ] } }
		
		const array:any = await producto.aggregate([
			{ $match: { 
					'pesable': {'$ne': true}, 
					'pCompra': true, 
					//'$lte': [ '$reposicion', '$compra' ]
				}
			}
			/*
			,
				{
					 $lookup: {
							from: "articulos",
							localField: "articulo",    // field in the orders collection
							foreignField: "_id",  // field in the items collection
							as: "fromItems"
					 }
				},
			*/
		])
		
		res.status(200).json(array);
	}

	async listado(req: Request, res: Response) {
		const { id } = req.params
		const list = await producto.find({ articulo: new ObjectID(id) });
		res.json(list);
	}

	async leer(req: Request, res: Response) {
		try {
			const { id } = req.params

			//const rpta = await producto.findById(id).populate();
			const qry = {
				Producto: {_id: new ObjectID(id)},
				hiddenData: {
					'art_margen':0,
					'compra': 0,
					'promeedio': 0,
					'sub.compra': 0,
					//'sub.margen': 0,
					'sub.reposicion': 0,
					'reposicion': 0,
				}
			}
			const rpta:any = await productoGetData(qry);
			const articulo:any = await readProductos({Articulo:{_id: new ObjectID(rpta[0]['articuloId']) }}, dataProduct({hidden: qry.hiddenData}));
			//rpta[0]['presentaciones'] = articulo[0].productos;				

			rpta[0]['presentaciones'] = [];
			for (let i = 0; i < articulo[0].productos.length; i++) {
				if(`${articulo[0].productos[i]['_id']}` !== `${rpta[0]['_id']}` && articulo[0].productos[i]['stock'] > 0)
					rpta[0]['presentaciones'].push( articulo[0].productos[i] );				
			}
			res.status(200).json(rpta);
		} catch (error) {
			res.json(error);
		}
	}

	async delete(req: Request, res: Response) {
		const { id } = req.params;
		producto.findByIdAndDelete( new ObjectID(id)).then(rpta => {
			res.status(200).json(rpta);
		}).catch(err => {
			console.log(err);
			res.status(500).json(err);
		})
	}

	async deleteMany(req: Request, res: Response) {
		const id = new ObjectID(req.params.id);
		producto.deleteMany({ "articulo": id })
			.then(rpta => {
				res.status(200).json(rpta);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json(err);
			})
	}
	async update(req: Request, res: Response) {
		try {
			const array = [];
			for (let i = 0; i < req.body.length; i++) {
				const e = req.body[i];
				e._id = new ObjectID(e._id);
				const rpta = await producto.updateOne( {_id: e._id}, { $set :  e  }, { upsert: true });
				array.push(rpta)
				//const reg = new producto(e);
				//const reslt = await reg.save();
			}
			res.status(200).json(array);
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}

	async insertMany(req: Request, res: Response) {
		try {
			console.log(req.body);
			const rpta = await producto.insertMany(req.body);
			res.status(200).json(rpta);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async add(req: Request, res: Response) {
		try {
//			const reg = await producto.findOne({ name: req.body.name });
//			if (reg)
//				return res.status(400).json({ msg: 'Registro ya existe', reg });
			if ( req.body._id ) req.body._id = new ObjectID( req.body._id );
			const newReg = new producto(req.body);
			await newReg.save();
			res.status(200).json({ msg: 'Registro creado satisfactoriamente', newReg });
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async import(req: Request, res: Response) {
		try {
/*
			if ( req.body._id ) req.body._id = new ObjectID( req.body._id );
			let prodReg = await producto.findOne({ _id: req.body._id });
      if ( prodReg === null ){
        prodReg = new producto(req.body);
      }
			console.log(prodReg);
*/
			
			//console.log(req.user)
			const toObjID = ['_id','articulo','parent'];
			for (let i = 0; i < toObjID.length; i++) {
				const e = toObjID[i];
				if( req.body[e] ) req.body[e] = new ObjectID(req.body[e])
			}
			const newReg = await producto.updateOne(
								{ _id: req.body._id },   // Query parameter
								{ $set: req.body }, 
								{ upsert: true }    // Options
							);
			res.status(200).json({ msg: 'Registro creado satisfactoriamente', newReg });
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	}

	async modifica(req: Request, res: Response) {
		const { id } = req.params;
		try {
			console.log(req.body)
			const ret = await producto.findOneAndUpdate({ _id:  new ObjectID(id) }, { $set: req.body });
			res.status(200).json({ msg: "Update Ok", old: ret, new: req.body });
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async search(req: Request, res: Response) {
		try {
			const { search } = req.params
			const qry = { "name": { $regex: new RegExp(search, 'i') } }
			const rpta = await producto.find(qry).sort({ name: 1 })
			res.status(200).json(rpta);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async buscar(req: Request, res: Response) {
		try {
			const qry = (req.body ? req.body : { Articulo: {}, Producto: {} });
			for (const key in qry.Articulo) {
				if (Object.prototype.hasOwnProperty.call(qry.Articulo, key)) {
					const array: any[] = qry.Articulo[key];
					if (key == '$and' || key == '$or') {
						for (let i = 0; i < array.length; i++) {
							for (const id in array[i]) {
								const element: any = array[i][id];
								if (element['$regex']) {
									qry.Articulo[key][i][id] = { $regex: new RegExp(element['$regex'], element['mod']) }
								}
							}
							console.log(qry.Articulo[key])
						}
					} else {
						const element = qry.Articulo[key];
						if (element['$regex']) {
							qry.Articulo[key]['$regex'] = new RegExp(qry.Articulo[key]['$regex'], 'i')
						}
						if (element['$in']) {
							if (element['$in']['$regExp']) {
								let array = element['$in']['$regExp']
								for (let index = 0; index < array.length; index++) {
									array[index] = new RegExp(`^${array[index]}`, 'i');
									console.log(array[index])
								}
								qry.Articulo[key]['$in'] = array
							}
						}
					}
				}
			}
			for (const key in qry.Producto) {
				if (Object.prototype.hasOwnProperty.call(qry.Producto, key)) {
					const element = qry.Producto[key];
					if (element['$regex']) {
						qry.Producto[key]['$regex'] = new RegExp(qry.Producto[key]['$regex'], 'i')
					}
				}
			}
			qry.showData = full_project;
			qry.hiddenData = invalidData;
			console.log(qry)
//			const rpta: any = await readProductos(qry);
			const rpta: any = await productoGetData(qry);
			res.status(200).json(rpta);
		} catch (error) {
			res.status(404).json(error);
		}
	}

	async fb(req: Request, res: Response){
		const fbShowData = {
			id: { $cond: [{ $eq:['$codigo', '']},'$_id','$codigo']},
			'title': '$fullName',
			//'rich_text_description': { $cond: [{ $eq: ['$detalles', '']}, '$art_fullName','$detalles'] },
			'description': { $cond: [{ $eq: ['$detalles', '']}, '$art_fullName','$detalles'] },
			'availability': {
				$cond: [ {$gte: [ '$stock', 1] }, 'in stock', 'out of stock'] 
			},
			'condition': 'new',
			'price':{
				$concat: [{ 
					$cond: [ { $eq:['$pesable', true] },
									{$toString: { $ceil:  '$calc_precio'  }},
									{$toString: { $multiply: [ { $ceil:{ $divide:['$calc_precio',10]}},10]}}
								]}, ' ARS']
			},
			'sale_price': { 
				$cond: [ { $and: ['$precio', {$lte: [ahora,'$precio_hasta']}, {$gte: [ahora, '$precio_desde']}]}, 
					{
						$concat: [{ 
							$cond: [ { $eq:['$pesable', true] },
										{$toString: '$precio'},
										{$toString: { $multiply: [ { $ceil:{ $divide:['$precio',10]}},10]}}
							]}, ' ARS']
					}, 
					{
						$concat: [{ 
							$cond: [ { $eq:['$pesable', true] },
											{$toString: { $ceil:  '$calc_precio'  }},
											{$toString: { $multiply: [ { $ceil:{ $divide:['$calc_precio',10]}},10]}}
										]}, ' ARS']
					}
				]
			},
			'sale_price_effective_date': {
				$concat: [ { $toString: '$precio_desde' },'/',{ $toString: '$precio_hasta' }]
			},
			'link': {
				$concat: ['https://firulais.net.ar/producto/',{$toString: '$_id'}]
			},
			'image_link': {
				$cond: [{ $regexMatch: { input: "$image", regex: /^http/ }  }, 
					'$image',
					{ $concat: ['https://firulais.net.ar','$image']} ]
			},
//			'video': 0,
			'brand': { 
				$cond: [{$ne: ['$marca','']},'$marca','firulais']
			},
			//93,pet supplies > pet carriers & containment
			//94,pet supplies > pet grooming supplies
			//95,pet supplies > small animal supplies
			//96,pet supplies > pet feeding & watering supplies
			//97,pet supplies > reptile & amphibian supplies
			//98,"pet supplies > pet collars, harnesses & leashes"
			//99,pet supplies > pet steps & ramps
			//100,pet supplies > bird supplies
			//101,pet supplies > pet care & health
			//102,pet supplies > pet beds & bedding
			//103,pet supplies > fish supplies
			//104,pet supplies > cat supplies
			//105,pet supplies > dog supplies
			//106,pet supplies
			
			'fb_product_category': { 
				$cond: [ { $in:['$especie', ['Perro','perro', 'Perros', 'perros']] },
					105,
					{	$cond: [ { $in:['$especie',['Gato','gato', 'Gatos', 'gatos']]},
						104,
						{ $cond: [ { $in:['$especie', ['Ave', 'ave', 'Aves', 'aves']]}, 
							100,
							106
						]}
					]}
				]
			},
			//'google_product_category': { 
			//	$cond: [ { $in:['$especie', ['Perro','perro', 'Perros', 'perros']] },
			//		'Animals & Pet Supplies > Pet Supplies > Dog Supplies',
			//		{	$cond: [ { $in:['$especie',['Gato','gato', 'Gatos', 'gatos']]},
			//			'Animals & Pet Supplies > Pet Supplies > Cat Supplies',
			//			{ $cond: [ { $in:['$especie', ['Ave', 'ave', 'Aves', 'aves']]}, 
			//				'Animals & Pet Supplies > Pet Supplies > Bird Supplies',
			//				'Animals & Pet Supplies > Pet Supplies'
			//			]}
			//		]}
			//	]
			//},
			'item_group_id': '$articuloId',
			'custom_label_0': '$marca',
			'custom_label_1': '$especie',
			'custom_label_2': '$raza',
			'custom_label_3': '$edad',
			'custom_label_4': '$rubro',
			'visibility': 'published',
			'_id': 0
			/*
			'quantity_to_sell_on_facebook': '$stock',
			'sale_price': 0,
			'sale_price_effective_date': 0,
			'additional_image_link': 0,
			'color': 0,
			'gender': 0,
			'size': '$contiene',
			'age_group': 0,
			'material': 0,
			'shipping': 0,
			'shipping_weight': 0,
			*/		
		}
		const fbFields =[
			'id',
			'title',
			'description',
			'rich_text_description',
			'availability',
			'condition',
			'price',
			'sale_price',
			'sale_price_effective_date',
			'link',
			'image_link',
			'brand',
			'fb_product_category',
			//'google_product_category',
			'item_group_id',
			'visibility',
			'custom_label_0',
			'custom_label_1',
			'custom_label_2',
			'custom_label_3',
			'custom_label_4'
		]
		let qry:any = {}; //req.body;
		qry.Producto = { pesable: {$ne: true }, pVenta: true, reposicion: { $gt: 0 } }

		const artList:any = await articulos.find({'private_web': { $ne: true }});
		for (let index = 0; index < artList.length; index++) {
			artList[index] = new ObjectID(artList[index]._id);
		}

		if (artList.length){
			qry.Producto['articulo'] = { '$in': artList };
		}

		qry.Sort = {title: 1}
		qry.Extra = { private_web: { $not: { $eq: true } } }
		qry.showData = fbShowData;
		qry.hiddenData = { 'private_web': 0 };

		const array: any = await productoGetData(qry);

		let retData = ""
		const line = []
		for (let n = 0; n < fbFields.length; n++) {
			const key = fbFields[n];
			line.push(key);
		}
		retData += line.join('	')+'\n';
		const patt = /\n/g
		const pat1 = /\,/g
		for (let i = 0; i < array.length; i++) {
			const e = array[i];
			const line = [];
			for (let n = 0; n < fbFields.length; n++) {
				const key = fbFields[n];
				if(key === 'description') {
					if (typeof e[key] === 'string'){
						e[key] = e[key].replace(patt," ");
						//e[key] = e[key].replace(pat1,' ');
						//e[key] = e[key].replace(pat1,'&#44;');
						//e[key] = e[key].replace(pat1,'');
						e[key] = `${e[key]}`;
					} else {
						e[key] = "no data";
					}
				} 
				line.push(e[key]);
			}
			retData += line.join('	')+'\n';
		}
//		var text={"hello.txt":"Hello World!","bye.txt":"Goodbye Cruel World!"};
//		res.set({"Content-Disposition":"attachment; filename=\"fbproduct.csv\""});
		res.set({'Content-Disposition': 'attachment; filename=\"fbproduct.csv\"','Content-type': 'text/csv'})
		res.send(retData);
//		res.status(200).write(retData)
	}
}

export const productoCtrl = new ProductoControler();
