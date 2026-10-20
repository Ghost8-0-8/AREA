import authRouter from './auth-service/authRouter';
import area_router from './areas/areaRouter';

import express from 'express';
const bodyParser = require('body-parser');


const router = express.Router();

router.use(bodyParser.json());

router.use('/auth', authRouter);
router.use("/area", area_router);

export default router;
