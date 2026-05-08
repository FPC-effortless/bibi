import { Router, type IRouter } from "express";
import healthRouter from "./health";
import commerceRouter from "./commerce";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/commerce", commerceRouter);
router.use("/payments", paymentsRouter);

export default router;
