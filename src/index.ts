import express from 'express';
import 'express-async-errors';
import config from './startup/config'
import userRoutes from './routes/userRoutes'

const app = express();
config();

app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
	console.log(`Auth service is running on PORT ${PORT}....`);
});

module.exports = server;