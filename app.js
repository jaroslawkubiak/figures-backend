require("dotenv").config({ path: "./16fee4d2c7ebfdff438a892abe812/.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, "1⛔", err.message);
  process.exit(1);
});

const app = require("./application");
const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Server running on ${process.env.NODE_ENV} port:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, "2⛔", err.message, "⛔");
  server.close(() => {
    process.exit(1);
  });
});
