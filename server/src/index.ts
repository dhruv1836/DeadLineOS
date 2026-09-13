import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { Router } from 'express';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Dummy routers for now to satisfy setup structure
const assignmentsRouter = Router();
const plannerRouter = Router();

assignmentsRouter.get('/', (req, res) => res.json({ message: 'Assignments router' }));
plannerRouter.get('/', (req, res) => res.json({ message: 'Planner router' }));

app.use('/api/assignments', assignmentsRouter);
app.use('/api/planner', plannerRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
