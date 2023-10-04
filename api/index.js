const express = require('express');
const cors = require('cors');
const {default:mongoose} = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const Location = require('./models/Location');
const Booking = require('./models/Booking');


const bcryptSalt = bcryptjs.genSaltSync(10);
const jwtsecret = "ieaof490ajv9348ncuqaiown984";

app.use(express.json());
app.use(cookieparser());
app.use('/uploads', express.static(__dirname+'/uploads'))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5174'
}));

let connect;

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtsecret, {}, async (err, userData) => {
            if(err) throw err;
            resolve(userData);
        });
    });
}

app.get('/test', (req,res) => {
    res.json("test ok");
});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try {
        connect = await mongoose.connect(process.env.MONGO_URL);
        const userRec = User.create({
            name, 
            email, 
            password:bcryptjs.hashSync(password, bcryptSalt)
        });
        res.json("Registration was a success!!" + userRec);
    } catch(e) {
        console.error(e);
        res.status(422).json(e);
        console.log("SOMETHING WENT WRONG, CANNOT CONNECT");
    }
})

app.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
        connect = await mongoose.connect(process.env.MONGO_URL);
        const userRec = await User.findOne({email}).exec();
        if(userRec) {
            const passok = bcryptjs.compareSync(password, userRec.password);
            if(passok) {
                jwt.sign({
                        email: userRec.email, 
                        id:userRec._id
                        }, jwtsecret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(userRec)
                })
            } else {
                res.status(422).json("pass not ok, but user record found")
            }
        } else {
            res.json("No user record found");
            
        }
    } catch(e) {
        console.error(e);
        res.status(422).json(e);
    }
})

app.get('/profile', async (req, res) => {
    const {token} = req.cookies;
    if(token) {
        connect = await mongoose.connect(process.env.MONGO_URL);
        jwt.verify(token, jwtsecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(userData.id)
            res.json({name, email, _id});
        })
    } else{
        res.json(null);
    }
})

app.post('/logout', async (req, res) => {
    res.cookie('token', '').json(true);
})

app.post('/upload_by_link', async (req, res) => {
    const {link} = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link, 
        dest: __dirname + '/uploads/' + newName
    });
    res.json(newName)
})

const photoMiddleware = multer({dest:'uploads/'})
app.post('/upload', photoMiddleware.array('photos', 100), (req,res) => {
    const uploadedFiles = []
    for(let i = 0; i < req.files.length; i++){
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''))
    }
    res.json(uploadedFiles)
});

app.post('/locations', async (req, res) => {
    connect = await mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {
        title, 
        address, 
        addedPhotos, 
        description, 
        features, 
        extraInfo, 
        checkIn, 
        checkOut, 
        maxGuests,
        price
    } = req.body;
    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name, email, _id} = await User.findById(userData.id)
        const locationDoc = await Location.create({
            owner: userData.id,
            title,
            address, 
            photos:addedPhotos, 
            description, 
            features, 
            extraInfo, 
            checkIn, 
            checkOut, 
            maxGuests,
            price
        });
        res.json(locationDoc);
    })
});

app.get('/user_locations', async (req, res) => {
    connect = await mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Location.find({owner:id}));
    })
    
});

app.get('/locations/:id', async (req, res) => {
    connect = await mongoose.connect(process.env.MONGO_URL);
    const {id} = req.params;
    res.json(await Location.findById(id));
    
});

app.put('/locations', async (req, res) => {
    connect = await mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {
        id,
        title, 
        address, 
        addedPhotos, 
        description, 
        features, 
        extraInfo, 
        checkIn, 
        checkOut, 
        maxGuests,
        price
    } = req.body;
    jwt.verify(token, jwtsecret, {}, async (err, userData) => {
        if (err) throw err;
        const locationDoc = await Location.findById(id);
        if(userData.id === locationDoc.owner.toString()) {
            locationDoc.set({
                title,
                address, 
                photos:addedPhotos, 
                description, 
                features, 
                extraInfo, 
                checkIn, 
                checkOut, 
                maxGuests,
                price
            })
            await locationDoc.save();
            res.json('ok');
        }
    })
});

app.get('/locations', async (req, res) => {
    connect = await mongoose.connect(process.env.MONGO_URL);
    res.json(await Location.find());
});

app.post('/booking', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    connect = await mongoose.connect(process.env.MONGO_URL);
    const {
        location,
        checkIn,
        checkOut,
        maxGuests,
        name,
        price,
        phone
    } = req.body;
    await Booking.create({
        location,
        checkIn,
        checkOut,
        maxGuests,
        name,
        phone,
        price,
        user: userData.id
    }).then((doc) => {
        res.json(doc)
    }).catch((err) => {
        throw err;
    })
});

app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json( await Booking.find({user:userData.id}).populate('location'))
})


app.listen(4000);