const mongoose = require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedtopology: true })

    .then(() => {
        console.log("DB Connected");

    })

    .catch((err) => console.log(err));