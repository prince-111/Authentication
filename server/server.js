const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


// middleware
app.use(cors());
app.use(express.json());

// Define PORT
const PORT = process.env.PORT || 5000;


app.get('/', (req, res)=>{
    res.send("Hello From the Authentication Server!");
})

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.use("/api/v1", authRoutes)
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/users", userRoutes);

// Mongo Connection
const URI = process.env.MONGODB_URI;
mongoose
  .connect(URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.error("MongoDb Connection Failed", err));


mongoose.connection.once("error",(err)=>{
    console.log('MongoDB connection error',err);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));