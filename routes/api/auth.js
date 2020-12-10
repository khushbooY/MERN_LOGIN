const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const UserModel = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require("config");

// GET /api/auth/profiles
// Get all profiles

router.get('/profiles', auth, async (req, res, next) => {


    try {
        const user = await UserModel.find().select('-password');
        res.json(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }

});



// Post /api/auth/logic
// @desc LOGIN USER 
router.post('/login', [
    // email 
    check('email', 'Please enter the valid email address')
        .isEmail()
        .normalizeEmail(),

    // Password  
    check('password', 'Password is required')
        .isLength({ min: 6 })
        .trim().exists()

], async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Invalid credentials' }); //input validation error
    }

    const { email, password } = req.body;   // extracting data from request

    try {
        let user = await UserModel.findOne({ email });

        //See user exist or not 
        if (!user) {
            return res.status(400).
                json({ errors: [{ message: "Invalid Credentials" }] })
        }

        // match user
        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({ errors: [{ message: "Invalid Credentials" }] })
        }


        // return json web token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'),
            {
                expiresIn: 60 * 60 * 90
            },
            (err, token) => {
                if (err) throw err;
                res.send({ token })
            })

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
});



// POST /api/auth/update/:id 



router.post("/update/:id", auth, (req, res) => {
    const id = req.params.id;
    console.log("MY DATA : ", id)

    UserModel.findById(id, (err, user) => {
        if (!user) {
            console.log(err);
            res.status(404).json({ "ERROR": "user is not present" })
        } else {
            console.log("MY DATA : ", user)
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;

            user.save()
                .then(() => {
                    res.status(200).send("user updation is successful");
                })
                .catch((err) => { res.status(400).send("user updation failed", err) })


        }
    })

})


// Delete /api/auth/update/:id 


router.delete('/delete/:mail', auth, (req, res) => {

    const email = req.params.mail;

    UserModel.find(email, (err, user) => {
        console.log('Data not found by this id - ', email);

        if (!user) {
            console.log('Data not found by this id - ', email);
            res.status(404).json({ "ERROR": "Data not found in db" })
        } else {
            console.log('Data  found by this id - ', email);

            res.status(200).send("user successfully deleted");
        }
    })

})





module.exports = router;
