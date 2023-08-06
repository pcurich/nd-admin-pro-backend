const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("debug", true);

mongoose
  .connect(process.env.DB_CNN + "/" + process.env.DB_CNN_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => console.log("Mongodb is connected to", process.env.DB_CNN_NAME))
  .catch((err) => {
    console.error(err);
  });

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database is connected to:", process.env.DB_CNN_NAME);
});
db.on("error", (err) => {
  console.error(err);
});
