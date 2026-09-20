import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { Router } from 'express';
import { authenticateToken } from './middleware/auth.js';
import { analyzePdf, createAssignment, deleteAssignment, listAssignments, updateAssignment, upload } from './controllers/assignments.js';
import { generatePlan, replan } from './controllers/planner.js';

config();

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by the API firewall.'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json({ limit: '1mb' }));

const assignmentsRouter = Router();
const plannerRouter = Router();

assignmentsRouter.use(authenticateToken);
assignmentsRouter.get('/', listAssignments);
assignmentsRouter.post('/', createAssignment);
assignmentsRouter.post('/analyze-pdf', upload.single('file'), analyzePdf);
assignmentsRouter.patch('/:id', updateAssignment);
assignmentsRouter.delete('/:id', deleteAssignment);
plannerRouter.use(authenticateToken);
plannerRouter.post('/', generatePlan);
plannerRouter.post('/replan', replan);

app.use('/api/assignments', assignmentsRouter);
app.use('/api/planner', plannerRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'deadlineos-ai-server', timestamp: new Date().toISOString() });
});

app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'PDF must be smaller than 10 MB.' });
  if (error?.message === 'Unexpected field' || error?.message?.includes('PDF')) return res.status(400).json({ error: 'Only one PDF file is accepted.' });
  console.error('Unhandled server error', error);
  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
