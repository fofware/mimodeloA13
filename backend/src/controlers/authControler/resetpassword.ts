import { Request, Response, Router } from "express";
import User, { IUser } from "../../models/user";
import verifyemail from "../../models/verifyemail";
import { generateEmailVerifyCode } from "./email";
import { verifyCode } from "./verifycode";


export const newcode = async (req: Request, res: Response): Promise<Response> => {
  try {
    const filter = {email: req.body.email }
    if(req.body.phone) filter['phone'] = req.body.phone
    const user = await User.findOne(filter)
    if(!user) {
      return res.status(200).json( { title: 'User Not Found', message: 'e-Mail y/o teléfono inválidos', codigo: false })
    }
    if(req.body.sender === 'email')
      await generateEmailVerifyCode(req.body.email);
    if(req.body.sender === 'wapp')
      console.log('Envia código por WhatsApp');
    return res.status(200).json({...req.body, codigo: true})
  } catch (error) {
    console.log(error);
    return res.status(500).json( error );
  }
}

export const confirmVerifycode = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reqData = {...req.body, ...req.query}
    const code = await verifyCode(reqData.email, reqData.verify);
    console.log(code);
    if (code)
      return res.status(200).json({...reqData, codigo: true})
    else
      return res.status(200).json({...reqData, codigo: false})
  } catch (error) {
    console.log(error);
    return res.status(500).json( error );
  }
}
