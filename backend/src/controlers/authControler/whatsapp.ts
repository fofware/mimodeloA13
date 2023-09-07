
export const checkWapp = async (number:string) => {
  const captchaRpta = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //body: `secret=${secretKey}&response=${recaptchaToken}`,
  }).then(res =>  res.json())

}