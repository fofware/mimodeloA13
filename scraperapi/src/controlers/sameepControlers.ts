//https://www.youtube.com/watch?v=gBnrdedhuU4

import { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer"

export const sameep = async (req:Request, res:Response, next: NextFunction ): Promise<any> => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //slowMo: 200
    });
    const page = await browser.newPage();
    await page.goto(`http://apps8.chaco.gob.ar/sameepweb/servlet/com.sameep.gamexamplelogin`);
    //await page.goto(`https://quotes.toscrape.com/`);

    await page.focus('#vUSERNAME');
    await page.keyboard.type('fofware');
    await page.focus('#vUSERPASSWORD');
    await page.keyboard.type('tamara01');
    await page.click('input[id="BTNENTER"]')
  
    const data = await page.evaluate(() => {
      const username = document.getElementById('vUSERNAME').innerText;
      const password = document.getElementById('vUSERPASSWORD').innerText;
      return {username,password}
    })
    
    await new Promise( r => setTimeout(r, 10000));
    await browser.close();
    res.status(200).json("read Ok");
  } catch (error) {
    console.log(error);    
  }
}