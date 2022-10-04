const express = require("express");
const mongoose = require('mongoose');
const app = express();
const port = 8080;
const dotenv = require("dotenv");
const { response } = require("express");
dotenv.config();

mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

let db = mongoose.connection;
db.on("error", () => console.error("Connection error."))
db.on("open", () => console.log("Connected to MongoDB!"))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User", userSchema);

app.post("/signup", (request, response) => {
    User.findOne({ username: request.body.username }, (error, result) => {
        if (result != null && result.username == request.body.username) {
            return response.send("Username is unavailable.")
        }

        let newUser = new User({
            username: request.body.username,
            password: request.body.password
        })

        newUser.save((error, savedTask) => {
            if (error) {
                return console.error(error)
            }
            else {
                return response.status(200).send('New user registered!')
            }
        })
    })
})

app.listen(port, () => console.log(`Server is running localhost:${port}`));