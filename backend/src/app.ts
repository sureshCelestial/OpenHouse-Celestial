import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import habitsRouter from './routes/habits';
import dashboardRouter from './routes/dashboard';
import healthRouter from './routes/health';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/health', healthRouter);
app.use('/api/habits', habitsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(errorHandler);

export default app;
