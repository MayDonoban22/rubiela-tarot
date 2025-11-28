const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
})();
