import { Router } from "express";
import users from "./users";

const router = Router();
export default (): Router =>{
    users(router);
    
    return router;
}