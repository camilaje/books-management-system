import { Request, Response } from 'express';
import * as svc from './auth.service';

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await svc.register(email, password);
    res.status(201).json(user);
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { token } = await svc.login(email, password);
    res.json({ token });
  }
};
