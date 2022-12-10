import menu from "./models/menu";
import user from "./models/user";
import config from './config';

const initUser = async () => {
  const u = await user.find();
  if (u.length === 0){
    const newUser = new user(config.defUser);
    await newUser.save();
  } 
}

const initMenu = async () => {
  const defMenu = [
    {
      menuGroup: 'admin',
      title: 'Administración',
      path: ',admin,',
      link: 'admin',
      icon: '',
      target: '',
      roles: ['sys_admin'],
    },
  ]
}
