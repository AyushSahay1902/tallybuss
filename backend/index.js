const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const tallyRouter = require('./routes/tally');
const { connectToDatabase } = require("./db");
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/tally', tallyRouter);

connectToDatabase().then(() => {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});