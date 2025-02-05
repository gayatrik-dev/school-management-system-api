const app = require('./app'); // Import the app instance from the app.js file
const dotenv = require('dotenv');

dotenv.config(); // Initialize environment variables from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});