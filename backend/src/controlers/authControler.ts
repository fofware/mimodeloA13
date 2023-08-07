/**
 * Guia de actualización
 * https://www.bezkoder.com/jwt-refresh-token-node-js-mongodb/?__cf_chl_tk=NoUAH8D4IAss7A9A4IhgrKKuSdr6cF4NQzJeFUeWsTY-1673961057-0-gaNycGzNCf0
 */

import { Request, Response, Router } from "express";
import User, { IUser } from "../models/user";
import { ExtractJwt } from "passport-jwt";
import jwt from 'jsonwebtoken';
import config from '../config';
import  RefreshToken  from '../models/refreshToken'
import { requestPromise } from "../common/httpClient-promise";

export interface iMenuData {
  name:string;
  title?: string;
  icon?: string;
  comment?: string;
  links: iMenuLink[];
}
export interface iMenuLink {
  icon?:string;
  title: string,
  link: string | string[],
  fragment?: string,
  roles?: string[],
  hidden?: boolean,
  outlet?: string,
  state?:any,
  target?:string,
  href?:string,
  rel?:string,
}

const menuData:iMenuData[] = [
  { 
    name: 'topMenu',
    title: 'Top Menu',
    icon: 'fas fa-cogs fa-4x',
    comment: '',
    links: [
      { 
        title: 'Home', 
        icon: '<i class="fas fa-home-lg"></i>', 
        link: 'home'
      },
      //{ title: 'Marcas', link: ['marca'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user' ] },
      { 
        title: 'Articulos', 
        link: ['articulos'] 
      },
      //{ title: 'Productos', link: ['productos'], roles: ['visitante','client_admin', 'client_user','sys_admin', 'sys_user'] },
    
      { 
        title: 'Aplicaciones', 
        link: ['users'], 
        roles: ['sys_admin', 'sys_user'] 
      },
      { 
        title: 'Aplicaciones', 
        link: ['users'], 
        roles: ['client_admin', 'client_user'] 
      },

      { 
        title: 'Sistema', 
        link: ['system'], 
        roles: ['sys_admin'] 
      },
      { 
        title: 'WhatsApp', 
        link: ['whatsapp'], 
        roles: ['sys_admin', 'sys_user'] 
      },
      { 
        title: 'WhatsApp', 
        link: ['whatsapp'], 
        roles: ['client_admin', 'client_user'] 
      },
      //{ title: 'Socket', link: ['socketdata'], roles: ['sys_admin', 'sys_user'] },
      //{ title: 'HttpData', link: ['htmldata'], roles: ['sys_admin', 'sys_user'] },
      //{ title: 'Usuarios', link: ['users'], roles: ['sys_admin', 'sys_user'] },
      //{ title: 'Proveedores', link: ['proveedores'], roles: ['proveedor_admin', 'proveedor_user','sys_admin', 'sys_user'] },
      //{ title: 'Temporal', link: ['temp'], roles: ['sys_admin', 'sys_user']},
    ]
  },
  {
    name: 'usersHome',
    title: 'Usuario',
    icon: 'fas fa-cogs fa-4x',
    comment: 'Puesta a punto el sistema',
    links: [
      { 
        title: 'Home',
        icon: '<i class="fas fa-home-lg"></i>',
        link: ['home']
      },
      { 
        title: 'Menues',
        icon:'<i class="fa-solid fa-bars"></i>',
        link: ['menues'],
        roles: ['sys_admin']
      },
      { 
        title: 'Contactos',
        icon:`<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 48 48">
        <path fill="#d6e5e5" d="M44.331,37.798c0-5,0.164-3.146,0.16-7.645c-0.004-3.752-0.686-4.392-0.532-7.081	c0.127-2.228,0.533-6.695,0.386-8.922c-0.2-3.044,0.242-6.066-2.555-8.229c-1.768-1.367-4.504-2.003-6.676-2.111	c-2.172-0.108-5.829,0.08-7.998-0.077c-6.082-0.439-4.617,0.1-10.251-0.128c-2.056-0.083-7.528-0.05-10.019,1.504	c-1.68,1.048-3.059,4.106-3.016,7.476c0.057,4.447,0.118,6.681,0.095,11.128c-0.009,1.699-0.098,3.553-0.106,5.253	c-0.007,1.371,0.257,4.528,0.279,5.899c0.02,1.275,0.099,4.203,0.205,5.508c0.106,1.305,1.143,2.679,2.286,3.32	c1.5,0.841,4.143,0.734,4.996,0.809c1.044,0.093,4.895-0.048,5.431-0.031c5.172,0.161,12.527-0.35,15.177-0.338	c3.513,0.016,5.052,0.001,7.138-0.335C42.333,43.314,44.523,41.707,44.331,37.798"></path><path fill="#73a1b2" d="M21.279,18.765c-0.96-0.179-1.997,0.123-2.71,0.79s-1.018,1.27-1.108,2.435	c-0.039,0.505,0.248,1.464,0.451,1.928c0.329,0.752,0.913,1.268,1.679,1.562c0.479,0.183,1.325,0.199,1.834,0.132	c0.779-0.103,2.072-0.634,2.81-1.601c0.722-0.946,0.713-2.345,0.109-3.37c-0.605-1.025-1.757-1.675-2.943-1.774"></path><path fill="#73a1b2" d="M30.405,33.411h-0.283c-1.522-1.801-4.482-3.254-6.785-3.764c-2.302-0.51-4.724-0.359-7.004,0.242	c-1.915,0.505-3.845,1.406-4.94,3.056l-0.057,0.214c2.624,3.051,7.092,4.019,11.161,3.781c2.664-0.156,5.491-0.82,7.286-2.794	C29.973,33.935,30.186,33.683,30.405,33.411z"></path><path fill="#010101" d="M21.347,37.473c-2.935,0-7.994-0.621-10.851-4.513c-1.364-1.857-2.095-4.281-2.299-7.627	c-0.165-2.702,0.061-4.821,0.712-6.67c2.123-6.027,8.438-8.388,13.582-7.615c4.199,0.36,9.141,2.761,10.729,7.315	c0.486,1.397,1.016,4.081,0.995,5.582c-0.04,3.031-0.552,4.479-1.798,7.295c-0.445,1.006-1.485,2.385-2.264,3.24	c-1.599,1.76-4.165,2.755-7.626,2.958C22.192,37.458,21.794,37.473,21.347,37.473z M20.549,11.904	c-4.321,0-8.994,2.255-10.697,7.091c-0.605,1.719-0.814,3.713-0.657,6.277c0.192,3.146,0.861,5.4,2.106,7.096	c3.003,4.09,8.808,4.21,11.166,4.072c3.192-0.188,5.528-1.073,6.945-2.632c0.749-0.824,1.707-2.109,2.09-2.973	c1.213-2.74,1.675-4.045,1.712-6.904c0.019-1.378-0.489-3.947-0.939-5.239c-1.442-4.138-6.004-6.321-9.885-6.649l-0.033-0.004	C21.768,11.949,21.161,11.904,20.549,11.904z"></path><path fill="#71c598" d="M44.345,34.113c-1.442,0.078-5.176-0.078-6.618,0l0.341,9.857c0,0,3.224-0.328,4.872-1.798	C45.21,40.149,44.345,34.113,44.345,34.113z"></path><path fill="#f58420" d="M44.345,34.113c-1.442,0.078-5.176-0.078-6.618,0l-0.05-10.068c1.352,0.099,4.295,0,5.647-0.091	l0.388-0.015l0.514,2.664l0.265,3.551L44.345,34.113z"></path><path fill="#010101" d="M30.122,33.911c-0.142,0-0.283-0.061-0.382-0.178c-1.471-1.74-4.389-3.128-6.511-3.599	c-2.087-0.463-4.428-0.381-6.769,0.237c-2.22,0.586-3.785,1.544-4.651,2.849c-0.153,0.23-0.463,0.291-0.693,0.141	c-0.23-0.153-0.293-0.463-0.14-0.693c1.005-1.516,2.765-2.613,5.229-3.263c2.494-0.656,4.998-0.744,7.24-0.247	c2.216,0.491,5.369,1.931,7.059,3.931c0.179,0.211,0.151,0.526-0.06,0.704C30.351,33.872,30.236,33.911,30.122,33.911z"></path><path fill="#16b7b8" d="M43.324,23.953c-1.353,0.092-3.978,0.084-5.33-0.015V14.16c1.254,0.16,5.088,0.058,6.35-0.01	l-0.097,4.565l-0.312,5.097L43.324,23.953z"></path><path fill="#010101" d="M20.8,26.147c-0.462,0-0.994-0.05-1.387-0.201c-0.91-0.348-1.587-0.979-1.959-1.827	c-0.183-0.418-0.543-1.497-0.492-2.168c0.096-1.256,0.427-1.979,1.265-2.762c0.827-0.773,2.034-1.127,3.143-0.916	c0.09,0.017,0.169,0.056,0.233,0.111c1.326,0.159,2.53,0.916,3.171,2.001c0.733,1.243,0.674,2.857-0.142,3.928	c-0.803,1.052-2.191,1.667-3.142,1.794C21.31,26.131,21.066,26.147,20.8,26.147z M20.724,19.214c-0.664,0-1.329,0.253-1.814,0.706	c-0.651,0.609-0.874,1.102-0.951,2.107c-0.028,0.36,0.198,1.204,0.411,1.69c0.266,0.605,0.737,1.041,1.4,1.295	c0.363,0.14,1.116,0.165,1.589,0.103c0.604-0.08,1.811-0.533,2.479-1.409c0.567-0.742,0.599-1.926,0.076-2.812	c-0.504-0.854-1.483-1.44-2.554-1.529c-0.114-0.009-0.216-0.057-0.294-0.128C20.952,19.222,20.838,19.214,20.724,19.214z"></path><path fill="#010101" d="M37.728,44.505c-0.031,0-0.062-0.003-0.093-0.009c-0.271-0.05-0.45-0.312-0.399-0.583	c0.19-1.024,0.116-2.533,0.052-3.865c-0.031-0.639-0.061-1.244-0.061-1.757c0-2.31-0.033-4.404-0.064-6.396	c-0.058-3.645-0.112-7.086,0.065-10.831c0.295-6.217,0.212-11.307-0.27-16.503c-0.025-0.274,0.177-0.519,0.452-0.544	c0.27-0.018,0.518,0.176,0.544,0.452c0.485,5.244,0.569,10.377,0.271,16.642c-0.176,3.714-0.124,6.982-0.063,10.768	c0.031,1.998,0.064,4.098,0.064,6.413c0,0.498,0.029,1.087,0.06,1.708c0.067,1.387,0.145,2.958-0.068,4.098	C38.174,44.337,37.963,44.505,37.728,44.505z"></path><path fill="#010101" d="M43.175,34.636c-0.632,0-1.372-0.012-2.137-0.022c-1.268-0.021-2.579-0.038-3.284-0.001	c-0.293,0.036-0.512-0.196-0.526-0.472c-0.016-0.276,0.196-0.512,0.472-0.526c0.742-0.041,2.07-0.021,3.354-0.001	c1.261,0.018,2.562,0.038,3.266,0.001c0.283-0.028,0.512,0.197,0.525,0.473c0.015,0.275-0.196,0.511-0.473,0.525	C44.057,34.63,43.646,34.636,43.175,34.636z"></path><path fill="#010101" d="M40.824,24.519c-1.059,0-2.135-0.027-2.867-0.081c-0.275-0.021-0.481-0.261-0.462-0.536	c0.021-0.275,0.263-0.482,0.536-0.462c1.325,0.099,3.932,0.106,5.259,0.015c0.269-0.023,0.514,0.189,0.533,0.465	c0.019,0.275-0.189,0.515-0.465,0.533C42.702,24.496,41.771,24.519,40.824,24.519z"></path><path fill="#010101" d="M40.356,14.745c-0.996,0-1.91-0.023-2.425-0.089c-0.274-0.035-0.469-0.285-0.434-0.559	c0.035-0.275,0.297-0.471,0.559-0.434c1.188,0.151,4.926,0.059,6.261-0.014c0.314-0.025,0.512,0.196,0.526,0.472	c0.016,0.276-0.196,0.512-0.472,0.526C43.611,14.689,41.888,14.745,40.356,14.745z"></path><path fill="#010101" d="M21.347,37.473c-2.935,0-7.994-0.621-10.851-4.513c-1.364-1.857-2.095-4.281-2.299-7.627	c-0.165-2.702,0.061-4.821,0.712-6.67c2.123-6.027,8.438-8.388,13.582-7.615c4.199,0.36,9.141,2.761,10.729,7.315	c0.486,1.397,1.016,4.081,0.995,5.582c-0.04,3.031-0.552,4.479-1.798,7.295c-0.445,1.006-1.485,2.385-2.264,3.24	c-1.599,1.76-4.165,2.755-7.626,2.958C22.192,37.458,21.794,37.473,21.347,37.473z M20.549,11.904	c-4.321,0-8.994,2.255-10.697,7.091c-0.605,1.719-0.814,3.713-0.657,6.277c0.192,3.146,0.861,5.4,2.106,7.096	c3.003,4.09,8.808,4.21,11.166,4.072c3.192-0.188,5.528-1.073,6.945-2.632c0.749-0.824,1.707-2.109,2.09-2.973	c1.213-2.74,1.675-4.045,1.712-6.904c0.019-1.378-0.489-3.947-0.939-5.239c-1.442-4.138-6.004-6.321-9.885-6.649l-0.033-0.004	C21.768,11.949,21.161,11.904,20.549,11.904z"></path><path fill="#010101" d="M12.816,45.035c-0.539,0-0.997-0.01-1.276-0.034c-0.162-0.015-0.391-0.021-0.666-0.03	c-1.205-0.04-3.221-0.106-4.531-0.841c-1.358-0.762-2.426-2.325-2.54-3.716c-0.11-1.362-0.188-4.376-0.206-5.541	c-0.01-0.614-0.069-1.589-0.129-2.599c-0.075-1.25-0.153-2.542-0.149-3.311c0.004-0.853,0.029-1.745,0.053-2.638	c0.024-0.884,0.049-1.769,0.053-2.615c0.017-3.357-0.015-5.493-0.055-8.196L3.33,12.592C3.287,9.213,4.654,5.888,6.581,4.686	c2.86-1.784,9.086-1.626,10.304-1.581c2.529,0.103,3.629,0.05,4.602,0.001c1.239-0.061,2.306-0.113,5.666,0.129	c1.15,0.082,2.755,0.069,4.307,0.052c1.371-0.012,2.666-0.024,3.679,0.024c1.026,0.051,4.562,0.362,6.958,2.215	c2.523,1.951,2.605,4.574,2.685,7.11c0.016,0.49,0.03,0.985,0.063,1.48c0.114,1.741-0.095,4.722-0.263,7.117	c-0.049,0.707-0.094,1.348-0.124,1.867c-0.073,1.285,0.054,2.09,0.2,3.022c0.155,0.987,0.331,2.106,0.333,4.03	c0.002,2.215-0.036,2.896-0.076,3.615c-0.041,0.731-0.084,1.486-0.084,4.017c0.18,3.71-1.645,5.898-5.421,6.506	c-2.164,0.351-3.777,0.355-7.219,0.343c-0.997-0.008-2.55,0.061-4.396,0.136c-3.333,0.136-7.48,0.302-10.794,0.202	c-0.172-0.006-0.704,0.006-1.373,0.021C14.754,45.012,13.681,45.035,12.816,45.035z M15.543,4.081c-2.175,0-6.388,0.177-8.433,1.452	C5.73,6.395,4.286,9.157,4.33,12.578L4.371,15.5c0.04,2.709,0.072,4.849,0.055,8.217c-0.004,0.853-0.029,1.745-0.053,2.638	c-0.024,0.884-0.049,1.769-0.053,2.615c-0.004,0.734,0.073,2.011,0.147,3.244c0.062,1.027,0.121,2.019,0.131,2.644	c0.018,1.155,0.094,4.138,0.203,5.476c0.087,1.065,0.96,2.323,2.032,2.924c1.098,0.616,2.961,0.678,4.075,0.714	c0.297,0.01,0.545,0.019,0.721,0.034c0.671,0.059,2.66,0.017,3.977-0.012c0.694-0.016,1.242-0.027,1.426-0.021	c3.273,0.1,7.405-0.067,10.723-0.201c1.86-0.075,3.488-0.138,4.44-0.137c3.388,0.011,4.969,0.008,7.056-0.329	c3.239-0.521,4.737-2.314,4.581-5.482l-0.001-0.024c0-2.568,0.043-3.339,0.085-4.085c0.04-0.706,0.077-1.372,0.075-3.559	c-0.001-1.847-0.171-2.925-0.32-3.876c-0.156-0.988-0.29-1.843-0.211-3.234c0.03-0.523,0.075-1.169,0.125-1.88	c0.157-2.24,0.372-5.31,0.262-6.981c-0.033-0.507-0.05-1.014-0.065-1.516c-0.078-2.516-0.146-4.688-2.296-6.351	c-1.722-1.331-4.433-1.909-6.396-2.008c-0.982-0.049-2.265-0.035-3.619-0.022c-1.569,0.019-3.195,0.032-4.389-0.054	c-3.297-0.237-4.339-0.187-5.544-0.128c-0.994,0.049-2.118,0.104-4.691,0C16.678,4.098,16.205,4.081,15.543,4.081z"></path>
        </svg>`,//'<i class="fa-regular fa-address-book fa-lg"></i>',
        link: ['contactos'],
        roles: ['sys_admin','client_admin','cliente_editor']
      },
      { 
        title: 'Proveedores',
        icon:'<i class="fa-solid fa-store"></i>',
        link: ['proveedores'],
        roles: ['sys_admin']
      },
      { 
        title: 'Clientes',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['clientes'],
        roles: ['sys_admin']
      },
      { 
        title: 'Mascotas',
        icon:'<i class="fa-solid fa-paw"></i>',
        link: ['mascotas'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Vehículos',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['vehiculos'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Configuraciones',
        icon:'<i class="fa-solid fa-sliders"></i>',
        link: ['settings'],
        //roles: ['sys_admin','client_admin']
      }
    ]
  },
  {
    name: 'system',
    title: 'Sistemas',
    icon: 'fas fa-cogs fa-4x',
    comment: 'Habilitación e Integración de Sistemas',
    links: [
      { 
        title: 'Mecado Pago',
        //icon: '<i class="fas fa-home-lg"></i>',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
              <ellipse cx="23.5" cy="23.5" fill="#4fc3f7" rx="21.5" ry="15.5"></ellipse><path fill="#fafafa" d="M22.471,24.946c-1.978-5.537-4.884-10.881-6.085-12.995c-0.352-0.619-0.787-1.186-1.29-1.69 l-2.553-2.553c-0.391-0.391-1.414,0-1.414,0L9.497,8.734l-0.162,2.319L8.773,11c-0.518,0-0.938,0.42-0.938,0.938 c0,0.52,0.413,0.969,0.933,0.961c1.908-0.03,3.567,1.601,3.567,1.601h2c0.32,0.32,1.139,1.366,1.328,2.439 c0.107,0.611,0.154,1.229,0.119,1.848C15.458,24.622,16.835,26,16.835,26c-5.5-3.5-14.819-2.964-14.819-2.964l0.193,3.016L5,31 c0.919,0.212,0.744-0.626,1.765-0.504c6.199,0.741,13.57,0.004,13.57,0.004c1.5,0,1.958-0.793,2.665-1.5 C24,28,22.849,26.004,22.471,24.946z"></path><path fill="#fafafa" d="M24.913,24.946c1.978-5.537,4.884-10.881,6.085-12.995c0.352-0.619,0.787-1.186,1.29-1.69 l2.553-2.553c0.391-0.391,1.414,0,1.414,0L37.814,9l0.235,2.053L38.611,11c0.518,0,0.938,0.42,0.938,0.938 c0,0.52-0.413,0.969-0.933,0.961c-1.908-0.03-3.567,1.601-3.567,1.601h-2c-0.32,0.32-1.139,1.366-1.328,2.439 c-0.107,0.611-0.154,1.229-0.119,1.848C31.926,24.622,30.549,26,30.549,26c5.5-3.5,15-3,15-3l-0.165,3l-3,5 c-0.919,0.212-0.744-0.626-1.765-0.504c-6.199,0.741-13.57,0.004-13.57,0.004c-1.5,0-1.958-0.793-2.665-1.5 C23.384,28,24.535,26.004,24.913,24.946z"></path><path fill="#1a237e" d="M43.832,16.326c-0.311-0.415-0.644-0.808-0.992-1.187c-0.059-0.064-0.123-0.123-0.183-0.186 c-0.309-0.326-0.628-0.639-0.96-0.938c-0.026-0.023-0.053-0.045-0.079-0.068c-0.587-0.522-1.201-1.012-1.845-1.454 c0.071-0.175,0.11-0.364,0.11-0.555c0-0.792-0.643-1.437-1.481-1.437c-0.001,0-0.003,0-0.004,0l-0.015,0.002V9.32 c0-0.534-0.288-1.032-0.75-1.299L36.269,7.24c-0.221-0.085-1.356-0.478-1.946,0.113l-1.837,1.838 c-0.381-0.106-0.89-0.25-1.211-0.326C28.893,8.288,26.446,8.014,24,8c-3.031-0.004-6.095,0.39-9.018,1.275l-1.921-1.921 c-0.59-0.59-1.725-0.199-2.018-0.079L9.75,8.021C9.288,8.288,9,8.786,9,9.32v1.186L8.938,10.5c-0.793,0-1.438,0.646-1.438,1.438 c0,0.311,0.103,0.614,0.283,0.865c-0.978,0.715-1.903,1.512-2.722,2.422c-0.315,0.35-0.616,0.715-0.9,1.096 C2.638,18.346,2.061,20.87,2,23.5c-0.035,2.628,0.455,5.223,1.932,7.343c1.478,2.132,3.451,3.854,5.624,5.163 c4.378,2.609,9.436,3.749,14.444,3.846c2.511-0.026,5.023-0.319,7.471-0.924c2.442-0.624,4.81-1.582,6.986-2.9 c2.163-1.328,4.143-3.041,5.617-5.18c1.476-2.122,1.932-4.719,1.894-7.347C45.905,20.87,45.357,18.348,43.832,16.326z M40.793,15.139c0.229,0.225,0.448,0.459,0.662,0.697c0.096,0.107,0.195,0.211,0.288,0.32c0.293,0.347,0.573,0.703,0.828,1.076 c1.088,1.579,1.785,3.39,1.957,5.242c-2.274-0.031-8.444,0.114-13.042,2.342c0.335-1.133,0.619-3.016,0.449-6.058 c-0.03-0.552,0.008-1.135,0.113-1.733c0.139-0.79,0.702-1.618,1.054-2.026h0.727c0.731,0,1.432-0.224,2.025-0.647 c0.624-0.444,1.559-0.981,2.588-0.954c0.072,0,0.139-0.03,0.21-0.04c0.267,0.192,0.536,0.383,0.792,0.587 c0.076,0.061,0.15,0.124,0.225,0.186c0.273,0.224,0.538,0.457,0.795,0.696C40.576,14.93,40.686,15.034,40.793,15.139z M24,9 c2.369,0.026,4.734,0.303,7.027,0.87c0.208,0.053,0.412,0.118,0.617,0.181c-0.482,0.503-0.906,1.054-1.246,1.652 c-1.175,2.068-4.124,7.483-6.121,13.075c-0.075,0.208-0.163,0.43-0.255,0.66c-0.112,0.281-0.226,0.572-0.331,0.868 c-0.104-0.296-0.219-0.588-0.331-0.868c-0.092-0.23-0.18-0.452-0.255-0.66c-2-5.599-4.947-11.009-6.121-13.075 c-0.297-0.523-0.667-1.004-1.074-1.456C18.522,9.461,21.264,9.054,24,9z M5.435,17.238c0.251-0.364,0.524-0.713,0.811-1.052 c0.094-0.112,0.196-0.218,0.294-0.327c0.202-0.225,0.408-0.448,0.625-0.662c0.115-0.114,0.233-0.224,0.351-0.335 c0.229-0.213,0.463-0.421,0.704-0.622c0.099-0.083,0.198-0.166,0.299-0.247c0.243-0.193,0.495-0.376,0.748-0.558 c0.886,0.089,1.707,0.522,2.262,0.918C12.123,14.776,12.823,15,13.555,15h0.727c0.352,0.407,0.915,1.235,1.054,2.026 c0.105,0.597,0.143,1.18,0.113,1.733c-0.17,3.042,0.114,4.927,0.449,6.059c-4.193-2.029-9.734-2.333-12.425-2.344 C3.648,20.623,4.346,18.814,5.435,17.238z M6.236,30.271c-0.192-0.224-0.396-0.437-0.572-0.673 C4.329,27.826,3.49,25.705,3.426,23.5c0-0.008,0.001-0.017,0.001-0.025c2.878,0.006,9.226,0.351,13.305,2.947 c0.211,0.134,0.484,0.088,0.646-0.104c0.162-0.19,0.153-0.477-0.014-0.662c-0.012-0.014-1.218-1.422-0.916-6.842 c0.035-0.63-0.007-1.29-0.126-1.962c-0.218-1.235-1.133-2.372-1.467-2.706C14.76,14.053,14.632,14,14.5,14h-0.945 c-0.522,0-1.021-0.159-1.445-0.462c-0.745-0.531-1.925-1.147-3.185-1.14c-0.131,0.004-0.226-0.063-0.281-0.117 C8.552,12.192,8.5,12.067,8.5,11.938c0-0.242,0.196-0.438,0.391-0.44l0.562,0.054c0.111,0.007,0.216-0.027,0.308-0.084l0.386,0.386 C10.242,11.949,10.37,12,10.5,12c0.053,0,0.106-0.009,0.158-0.025l1.207-0.402l1.281,1.281C13.244,12.951,13.372,13,13.5,13 s0.256-0.049,0.354-0.146c0.195-0.195,0.195-0.512,0-0.707L12.707,11l0.146-0.146C12.951,10.756,13,10.628,13,10.5 s-0.049-0.256-0.146-0.354l-1-1c-0.195-0.195-0.512-0.195-0.707,0C11.049,9.244,11,9.372,11,9.5s0.049,0.256,0.146,0.354 l0.646,0.646l-0.063,0.063l-1.095,0.365L10,10.293V9.32c0-0.178,0.096-0.344,0.25-0.434l1.22-0.712 c0.365-0.139,0.792-0.179,0.883-0.114l2.554,2.554c0.475,0.475,0.882,1.007,1.209,1.583c1.161,2.043,4.076,7.393,6.049,12.917 c0.078,0.219,0.171,0.452,0.267,0.694c0.347,0.871,0.741,1.858,0.58,2.583C22.808,29.309,21.728,30,20.49,30 c-0.07,0.002-7.123,0.139-13.425,0.011C6.798,30.002,6.509,30.114,6.236,30.271z M37.217,33.918 c-1.98,1.119-4.156,1.898-6.385,2.419c-2.228,0.539-4.528,0.798-6.832,0.812c-4.592,0.01-9.259-0.951-13.23-3.208 c-1.401-0.799-2.709-1.764-3.832-2.891c0.036-0.014,0.083-0.038,0.107-0.039C13.367,31.138,20.439,31.001,20.5,31 c1.396,0,2.616-0.673,3.192-1.67c0.575,0.997,1.794,1.67,3.182,1.67c0.071,0.002,7.146,0.139,13.462,0.011 c0.089,0.003,0.272,0.102,0.483,0.249C39.748,32.289,38.531,33.185,37.217,33.918z M42.329,29.593 c-0.247,0.329-0.526,0.635-0.803,0.941c-0.37-0.273-0.81-0.524-1.192-0.524c-0.005,0-0.011,0-0.017,0 c-6.3,0.125-13.354-0.01-13.434-0.011c-1.228,0-2.308-0.691-2.512-1.608c-0.161-0.725,0.232-1.712,0.58-2.583 c0.096-0.242,0.189-0.476,0.267-0.694c1.971-5.518,4.887-10.871,6.049-12.917c0.327-0.576,0.734-1.108,1.209-1.583l2.55-2.551 C35.122,8,35.548,8.037,35.841,8.14l1.293,0.747c0.154,0.09,0.25,0.256,0.25,0.434v0.973l-0.635,0.635l-1.095-0.365L35.591,10.5 l0.646-0.646c0.098-0.098,0.146-0.226,0.146-0.354s-0.049-0.256-0.146-0.354c-0.195-0.195-0.512-0.195-0.707,0l-1,1 c-0.098,0.098-0.146,0.226-0.146,0.354s0.049,0.256,0.146,0.354L34.677,11l-1.146,1.146c-0.195,0.195-0.195,0.512,0,0.707 C33.628,12.951,33.756,13,33.884,13s0.256-0.049,0.354-0.146l1.281-1.281l1.207,0.402C36.777,11.991,36.831,12,36.884,12 c0.13,0,0.258-0.051,0.354-0.146l0.386-0.386c0.092,0.057,0.197,0.092,0.308,0.084l0.515-0.052c0.242,0,0.438,0.196,0.438,0.438 c0,0.129-0.052,0.254-0.143,0.343c-0.056,0.055-0.157,0.109-0.282,0.117c-1.279,0.011-2.439,0.608-3.185,1.14 C34.851,13.841,34.352,14,33.83,14h-0.946c-0.133,0-0.26,0.053-0.354,0.146c-0.334,0.334-1.25,1.473-1.467,2.706 c-0.118,0.674-0.161,1.334-0.126,1.963c0.302,5.419-0.904,6.827-0.907,6.831c-0.18,0.181-0.196,0.468-0.037,0.666 c0.159,0.199,0.442,0.246,0.659,0.109c4.408-2.805,11.576-2.969,13.922-2.942c0,0.007,0.001,0.013,0.001,0.02 C44.507,25.705,43.666,27.824,42.329,29.593z"></path>
              </svg>`,
        link: '/mp'
      },
      { 
        title: 'Menues',
        icon:`<i class="fa-solid fa-bars"></i>`,
        link: '/system/menues',
        roles: ['sys_admin']
      },
      { 
        title: 'Contactos',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 80 80">
        <path fill="#e1ebf2" d="M17.091,75.5C10.148,75.5,4.5,69.852,4.5,62.909V17.091C4.5,10.148,10.148,4.5,17.091,4.5h45.818 c6.942,0,12.591,5.648,12.591,12.591v45.818c0,6.942-5.648,12.591-12.591,12.591H17.091z"></path><path fill="#788b9c" d="M62.909,5C69.576,5,75,10.424,75,17.091v45.818C75,69.576,69.576,75,62.909,75H17.091 C10.424,75,5,69.576,5,62.909V17.091C5,10.424,10.424,5,17.091,5H62.909 M62.909,4H17.091C9.891,4,4,9.891,4,17.091v45.818 C4,70.109,9.891,76,17.091,76h45.818C70.109,76,76,70.109,76,62.909V17.091C76,9.891,70.109,4,62.909,4L62.909,4z"></path><path fill="#c5d4de" d="M75.5,17.09v5.41h-10V4.78C71.2,5.96,75.5,11.04,75.5,17.09z"></path><path fill="#788b9c" d="M76,23H65V4.166l0.602,0.125C71.627,5.538,76,10.921,76,17.09V23z M66,22h9v-4.91 c0-5.49-3.749-10.306-9-11.679V22z"></path><rect width="10" height="17.5" x="65.5" y="22.5" fill="#8bb7f0"></rect><path fill="#4e7ab5" d="M76,40.5H65V22h11V40.5z M66,39.5h9V23h-9V39.5z"></path><rect width="10" height="17.5" x="65.5" y="40" fill="#ffc49c"></rect><path fill="#a16a4a" d="M76,58H65V39.5h11V58z M66,57h9V40.5h-9V57z"></path><path fill="#bae0bd" d="M75.5,57.5v5.41c0,6.05-4.3,11.13-10,12.31V57.5H75.5z"></path><path fill="#5e9c76" d="M65,75.834V57h11v5.91c0,6.169-4.373,11.552-10.398,12.799L65,75.834z M66,58v16.589 c5.251-1.373,9-6.188,9-11.679V58H66z"></path><path fill="#c5d4de" d="M50.9,54.46c-3.93,4.33-9.6,7.04-15.9,7.04s-11.97-2.71-15.9-7.04c3.52-4.21,9.33-6.96,15.9-6.96 S47.38,50.25,50.9,54.46z"></path><path fill="#788b9c" d="M35,62c-12.131,0-22-9.869-22-22s9.869-22,22-22s22,9.869,22,22S47.131,62,35,62z M35,19 c-11.579,0-21,9.421-21,21s9.421,21,21,21s21-9.421,21-21S46.579,19,35,19z"></path><ellipse cx="35" cy="35.5" fill="#c5d4de" rx="7.5" ry="8"></ellipse><path fill="#788b9c" d="M35,44c-4.411,0-8-3.813-8-8.5s3.589-8.5,8-8.5s8,3.813,8,8.5S39.411,44,35,44z M35,28 c-3.859,0-7,3.364-7,7.5s3.141,7.5,7,7.5s7-3.364,7-7.5S38.859,28,35,28z"></path><path fill="#788b9c" d="M50.517,54.78C46.966,50.535,41.166,48,35,48s-11.966,2.535-15.517,6.78l-0.768-0.641 C22.454,49.669,28.542,47,35,47s12.546,2.669,16.284,7.14L50.517,54.78z"></path>
        </svg>`,
        link: ['..','contactos'],
        roles: ['sys_admin','client_admin','cliente_editor']
      },
      { 
        title: 'Proveedores',
        icon:'<i class="fa-solid fa-store"></i>',
        link: ['proveedores'],
        roles: ['sys_admin']
      },
      { 
        title: 'Clientes',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['clientes'],
        roles: ['sys_admin']
      },
      { 
        title: 'Mascotas',
        icon:'<i class="fa-solid fa-paw"></i>',
        link: ['mascotas'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Vehículos',
        icon:'<i class="fa-solid fa-truck-field-un"></i>',
        link: ['vehiculos'],
        roles: ['sys_admin','client_admin']
      },
      { 
        title: 'Configuraciones',
        icon:'<i class="fa-solid fa-sliders"></i>',
        link: ['settings'],
        //roles: ['sys_admin','client_admin']
      }
    ]
  }
]

const setMenu = async (user, defmenu:iMenuLink[]): Promise<iMenuLink[]> => {
  return new Promise( (resolve, reject) => {
    try {
      //console.log('SetMenu for ',user);
      //console.log(user?.email);
      const usrMenu:iMenuLink[] = defmenu.filter( (item:iMenuLink) => {
        if (item.roles?.length){
          for (let ir:number = 0; ir < item.roles.length; ir++) {
            const rol = item.roles[ir];
            const roles:string[] | string | undefined = user?.roles;
            //console.log(item.title, roles,rol,roles?.indexOf(rol))
            if (rol && roles) {
              if( typeof roles === 'string') return true;
              if(roles?.indexOf(rol) > -1) return true;
            }
          }
          return false;
        }
        //console.log(item.title, item.roles);
        return true;
      })
      //usrMenu.map( it => delete(it.roles))
      //console.log(usrMenu);
      resolve(usrMenu);
    } catch (error) {
      console.log(error);
      const retvalue: iMenuLink[] = []
      reject( retvalue );
    }
  })
}

function createToken(user: IUser | any ) {
  //const menu:iMenuLink[] = await setMenu(user);
  return jwt.sign({
    _id: user._id,
    email: user.email,
    apellido: user.apellido,
    nombre: user.nombre,
    site: [],
    menu: user.menu,
    accounts: [],
    roles: user.roles,
    phone: user.phone,
    group: user.group,
    nickname: user.nickname || `${user.nombre} ${user.apellido}`,
    image: '/assets/images/defuser.png',
  }, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  /*
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ msg: 'Por favor. Envíe su e-Mail y contraseña' });
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ msg: 'eMail ya está registrado' });
  const userwapp = await User.findOne({ whatsapp: req.body.whatsapp });
  if (userwapp) return res.status(400).json({ msg: 'WhatsApp ya está registrado existe' });
  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).json({msg: 'Las contraseñas no coinciden'})
  delete req.body.confirmPassword;
  */
  const userIp = req.socket.remoteAddress;
  const recaptchaToken = req.body.captcha;
  const secretKey = config.captchaKey;
  

  /*
  const options = {
    host: 'firulais.net.ar',
    path: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
    method: 'GET',
    port: 443,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    }
  }
  */
  const options = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
    method: 'GET'
  }
  const captchaRpta = JSON.parse( await requestPromise(options));
  /*
  const captchaRpta = JSON.parse(await request.get(
    {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}&remoteip=${userIp}`,
    }));

    //.then((response) => {
    //  console.log(response)
    //// If response false return error message
    //if (response.success === false) {
    //    return res.status(200).json({success: false, error: 'Recaptcha token validation failed'});
    //}
    //// otherwise continue handling/saving form data
    //    return response
    //})
  */
  console.log('-------------------')
  console.log(captchaRpta);
  console.log('-------------------')
  if ( captchaRpta.score < .7 )
    return res.status(401).json({ title: 'Hmmm....', text: 'Parece no ser humano...' })
  console.log(req.body);
  const user = {
    email: req.body.email,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    roles: ['client_admin'],
    group: 'user',
    phone: req.body.phone,
    password: req.body.password
  }
  const newUser = new User(user);
  await newUser.save();
  delete newUser.password;
  const token = createToken(newUser);
  console.log(newUser);
  delete newUser.__v;
  delete newUser.password;
  newUser.__v = null;
  newUser.password = null;
  return res.status(200).json({ token, newUser });
};

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password)
    return res.status(401).json({ title: 'Datos insuficientes', text: 'Usuario y contraseña son requeridos' });
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ title: 'No Autorizado', text: 'Usuario y/o contraseña ivalidos' });
  const isMatch = await user.comparePassword(req.body.password);
  if (!isMatch)
    return res.status(401).json({ title: 'No Autorizado', text: 'Contraseña y/o Usuario ivalidos' });
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let fromUrl = req.headers.origin; // req.headers.referer
  delete user.__v ;
  delete user.password;
  user.password = null;
  user.__v = null
  //user['menu'] = await setMenu(user);
  //console.log(user);
  const token = createToken(user);
  return res.status(200).json( token );
};

export const getmenu = async (req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;
  const menuIdx = menuData.findIndex(m => m.name === id);
  //console.log("GetMenu",id,req.user, menuIdx,menuData[menuIdx])
  try {
    const menu = await setMenu(req.user, menuData[menuIdx].links);
    //console.log(menu);
    return res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
export const fullmenu = async (req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;
  //console.log("GetMenu",id,req.user)
  const menuIdx = menuData.findIndex(m => m.name === id);
  const menu = menuData[menuIdx]
  try {
    menu.links = await setMenu(req.user, menuData[menuIdx].links);
    return res.status(200).json(menu);
  } catch (error) {
    console.log(error);    
    return res.status(500).json(error);
  }
}

/*
export const getvmenu = async ( req: Request, res: Response): Promise<Response> => {
  const {id} = req.params;
  console.log("GetVMenu",id,req.user)
  const menu = await setMenu(req.user, menuData[id].options);
  return res.status(200).json(menu);
}
*/
/*
export const refreshtoken = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
*/
export const emailcheck = async (req: Request, res: Response) => {
  const { email } = req.params;
  console.log(email);
  User.findOne( { email })
  .then( ( rpta: any ) => {
    console.log(rpta);
    if(!rpta) return res.status(200).json( { exists: false } );
    else return res.status(200).json( { exists: true } );
  }).catch( (err: any) => {
    return res.status(404).json( err );
  })
  
}

export const nicknamecheck = async (req: Request, res: Response) => {
  const { nickname } = req.params;
  console.log(nickname);
  User.findOne( { nickname })
  .then( ( rpta: any ) => {
    console.log(rpta);
    if(!rpta) return res.status(200).json( { exists: false } );
    else return res.status(200).json( { exists: true } );
  }).catch( (err: any) => {
    return res.status(500).json( err );
  })
}