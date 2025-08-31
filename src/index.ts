import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import usersRouter from "./routes/userRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import serviceRouter from "./routes/servicesRoute.js";

// Load environment variables
dotenv.config();
const app = express();

app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Urban Company Backend API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;


app.use("/users", usersRouter);
app.use("/book", bookingRouter);
app.use("/service", serviceRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
