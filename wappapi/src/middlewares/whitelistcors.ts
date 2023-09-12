import { NextFunction, Request, Response } from "express";

const allowlist = [
  'vta.ar'
]
export const corsWhiteList = (req:Request, res:Response, next:NextFunction) => {
  let valid = false;
  const ori:string = `${req.header('Origin')}`;
  for (let i = 0; i < allowlist.length; i++) {
    const a = allowlist[i];
    console.log(a, `${req.header('Origin')}`, ori.includes(a));
    if( ori.includes(a)){
      valid = true;
      break;
    }
  }
  if(valid){
    next();
  } else {
    res.status(403).json({message: 'Unauthorized wapi'});
  }
}
