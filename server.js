require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cors());
app.use('/files', fileRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
