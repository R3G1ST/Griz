import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import statsRouter from "./stats";
import slotsRouter from "./slots";
import reviewsRouter from "./reviews";
import loyaltyRouter from "./loyalty";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(statsRouter);
router.use(slotsRouter);
router.use(reviewsRouter);
router.use(loyaltyRouter);

export default router;
