import verifyemail from "../../models/verifyemail";

export const randVerifyNumber = (min=100000, max=999999):Number => {
  //const range = {min: 100000, max: 999999}
  const delta = max - min;
  return Math.round(min + Math.random() * delta)
}

export const verifyCode = async (email:string,verify:number) => {
  const filter = {
    email,
    verify
  }
  console.log('filter',filter);
  return await verifyemail.findOne(filter);
}


