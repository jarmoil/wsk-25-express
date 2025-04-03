import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {login} from '../models/user-model.js';

const authUser = async (req, res) => {
  try {
    const {username, password} = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({error: 'Username and password are required'});
    }

    // Query the database for the user
    const user = await login(username);
    if (!user) {
      return res.status(401).json({error: 'Invalid username or password'});
    }

    // Compare the provided password with the hashed password
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({error: 'Invalid username or password'});
    }

    // Remove the password from the user object
    const userWithoutPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Generate a JWT token
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Respond with the user data and token
    res.json({user: userWithoutPassword, token});
  } catch (error) {
    console.error('Error in POST /auth/login:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

const getMe = async (req, res) => {
  console.log('getMe', res.locals.user);
  if (res.locals.user) {
    res.json({message: 'token ok', user: res.locals.user});
  } else {
    res.sendStatus(401);
  }
};

export {authUser, getMe};
