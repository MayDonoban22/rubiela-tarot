require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {

        const email = "admin@luzderubi.com";

        const existing = await User.findOne({ email });

        if (existing) {
            console.log("⚠️ Admin ya existe");
            process.exit();
        }

        const admin = new User({
            name: "Admin",
            email: email,
            password: "Admin123*",
            role: "admin"
        });

        await admin.save();

        console.log("✅ Admin creado correctamente");
        console.log("email:", email);
        console.log("password: Admin123*");

        process.exit();

    })
    .catch(err => {
        console.log(err);
    });