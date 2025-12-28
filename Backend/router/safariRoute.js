import express from 'express';
import {createSfari} from '../controller/safariController.js';
import upload from '../middleware/multer.js';

const safariRouter = express.Router();


const uplodImage =upload.fields([
    {name:'mainImage' ,maxCount:1},
    {name:'images' ,maxCount:10},
    {name:'shortvideo' , maxCount:1}
]);

safariRouter.post('/addsafari' , uplodImage, createSfari);
export default safariRouter;


