import { NextFunction, Request, Response } from 'express';
import {Document, Model, Types} from 'mongoose';
import { makeFilter } from '../common/utils';

export interface genericOptions {
  limit?: number;
  offset?: number;
  searchItem?: string;
  fieldstr?: string[];
  populate?: string[];
  sort?: {};
  projection?: {};
  searchBy?: string[];
}

const defOptionsValues: genericOptions = {
  limit: 50,
  offset: 0,
  searchItem: '',
  fieldstr: [],
  populate: [],
  sort: {},
  projection: {}
}

const docAdd = (model: Model<any>) => async (req: Request, res: Response, next: NextFunction) => {
  console.log('Creando nuevo documento en', model.modelName)
  try {
    //const params = Object.assign(req.query,req.params,req.body);
    const doc = new model({
      _id: new Types.ObjectId(),
      ... req.body
    });
    const result = await doc.save();
    res.status(201).json(result)
  } catch (err) {
   /*
    console.log(JSON.parse(JSON.stringify(err)))
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      //user: req.user,
      //otro: req.ip,
      //headers: req.headers,
      filter: Object.assign(req.query,req.params,req.body),
      collection: model.modelName,
      ...JSON.parse(JSON.stringify(err))
    }
    */
    res.status(500).json( errorHandle(req, model, err) )    
  }
};

const docGetAll = (model: Model<any>, options?:genericOptions) => async (req: Request, res: Response, next: NextFunction) => {
  console.log('Leyendo documentos de', model.modelName)
  try {
    const opt = Object.assign(defOptionsValues, options);
    const params = Object.assign({
      limit: opt.limit,
      offset: opt.offset,
      iniTime: new Date().getTime(),
      searchItem: opt.searchItem
    },req.query,req.params,req.body);

    params.limit = typeof(params.limit) === 'string' ? parseInt(params.limit) : params.limit;
    params.offset = typeof(params.offset) === 'string' ? parseInt(params.offset) : params.offset;

    const filter = makeFilter(opt.fieldstr,params)
    const count = await model.count(filter);
    console.log("limit",params.limit, typeof(params.limit));      
    let nextOffset = params.offset+params.limit;
    nextOffset = nextOffset > count ? false : params.offset+params.limit;
    console.log(opt.projection);
    const rows = await model.find<Document>(filter,opt.projection)
      .skip(params.offset)
      .limit(params.limit)
      .populate( opt.populate )
      .sort(opt.sort)
    const ret = {
      url: req.headers.host+req.headers['x-original-uri'],
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
    res.status(200).json(ret)
  } catch (err) {
    /*
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      //user: req.user,
      //otro: req.ip,
      //headers: req.headers,
      filter: Object.assign(req.query,req.params,req.body),
      collection: model.modelName,
      ...JSON.parse(JSON.stringify(err))
    }
    */
    res.status(500).json( errorHandle(req, model, err) )    
  }
};

const docGet = (model: Model<any>, options?:genericOptions) => async (req: Request, res: Response, next: NextFunction) => {
  console.log('Leyendo documento de', model.modelName);
  console.log("Model", model);
  console.log("Model.Schema", model.schema);
  try {
    const opt = Object.assign(defOptionsValues, options);
    const params = Object.assign(req.query,req.params,req.body);
    const filter:any = {}
    for (let i = 0; i < opt.searchBy.length; i++) {
      const e = opt.searchBy[i];
      filter[e] = params[e]
    }
    const rows = await model.findOne<Document>(filter,opt.projection)
      .populate( opt.populate )
    if ( rows )
      return res.status(200).json(rows);
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      filter,
      collection: model.modelName,
      message: `Registro no existe en ${model.modelName}`
    }
    res.status(404).json({error})
  } catch (err) {
    /*
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      //user: req.user,
      //otro: req.ip,
      //headers: req.headers,
      filter: Object.assign(req.query,req.params,req.body),
      collection: model.modelName,
      ...JSON.parse(JSON.stringify(err))
    }
    */
    res.status(500).json( errorHandle(req, model, err) )    
  }
}

const docUpdate = (model: Model<any>, options?:genericOptions) => async (req: Request, res: Response, next: NextFunction) => {
  console.log('Modificando documento en', model.modelName)
  try {
    const opt = Object.assign(defOptionsValues, options);
    const params = Object.assign(req.query,req.params,req.body);
    const filter:any = {}
    for (let i = 0; i < opt.searchBy.length; i++) {
      const e = opt.searchBy[i];
      filter[e] = params[e]
    }
    const rows = await model.findOne<Document>(filter,opt.projection)
      .populate( opt.populate )
    res.status(200).json(rows)
  } catch (err) {
    /*
    console.log(JSON.parse(JSON.stringify(err)))
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      //user: req.user,
      //otro: req.ip,
      //headers: req.headers,
      filter: Object.assign(req.query,req.params,req.body),
      collection: model.modelName,
      ...JSON.parse(JSON.stringify(err))
    }
    */
    res.status(500).json( errorHandle(req, model, err) )    
  }
}

const docDelete = (model: Model<any>, options?:genericOptions) => async (req: Request, res: Response, next: NextFunction) => {
  console.log('Modificando documento en', model.modelName)
  try {
    const opt = Object.assign(defOptionsValues, options);
    const params = Object.assign(req.query,req.params,req.body);
    const filter:any = {}
    for (let i = 0; i < opt.searchBy.length; i++) {
      const e = opt.searchBy[i];
      filter[e] = params[e]
    }
    const rows = await model.findOne<Document>(filter,opt.projection)
      .populate( opt.populate )
    res.status(200).json(rows)
  } catch (err) {
    /*
    console.log(JSON.parse(JSON.stringify(err)))
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      //user: req.user,
      //otro: req.ip,
      //headers: req.headers,
      filter: Object.assign(req.query,req.params,req.body),
      collection: model.modelName,
      ...JSON.parse(JSON.stringify(err))
    }
    */
    console.log(JSON.parse(JSON.stringify(err)))
    const error = {
      url: req.headers.host+req.headers['x-original-uri'],
      //user: req.user,
      //otro: req.ip,
      //headers: req.headers,
      filter: Object.assign(req.query,req.params,req.body),
      collection: model.modelName,
      ...JSON.parse(JSON.stringify(err))
    }
    res.status(500).json( errorHandle(req, model, err) )    
  }
}
export const errorHandle = (req:Request, model: Model<any>, err:any) => {
  console.log(JSON.parse(JSON.stringify(err)))
  const error = {
    url: req.headers.host+req.headers['x-original-uri'],
    //user: req.user,
    //otro: req.ip,
    //headers: req.headers,
    filter: Object.assign(req.query,req.params,req.body),
    collection: model.modelName,
    ...JSON.parse(JSON.stringify(err))
  }
  return { error }    
}

export default { 
  docAdd, 
  docGet, 
  docGetAll, 
  docUpdate, 
  docDelete,
};