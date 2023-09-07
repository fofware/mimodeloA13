import {Strategy, ExtractJwt, StrategyOptions} from 'passport-jwt';
import config from '../config';
import User from '../models/user';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}

export default new Strategy( opts, async (payload, done) =>
{
  //console.log('payload',payload);
  try {
    //const user = await User.findById(payload._id,{password:0});
    const user = await User.findByIdAndUpdate(payload._id,{lastlogin: Date.now()}, {new: true});
    console.log(user);
    if (user && user.status) return done(null, user);
    return done(null, false);
  } catch (error) {
    console.log(error);    
  }
});