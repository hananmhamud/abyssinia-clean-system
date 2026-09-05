const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Register User
const register = async (req, res) => {

    try {

        const {
            full_name,
            email,
            phone,
            password,
            role,
            address
        } = req.body;


        // Check existing email
        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );


        if(existingUser.length > 0){
            return res.status(400).json({
                message:"Email already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Insert user
        const [result] = await db.query(
            `INSERT INTO users 
            (full_name,email,phone,password,role,address)
            VALUES (?,?,?,?,?,?)`,
            [
                full_name,
                email,
                phone,
                hashedPassword,
                role,
                address
            ]
        );


        res.status(201).json({
            message:"User registered successfully",
            user_id: result.insertId
        });


    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



// Login User
const login = async (req,res)=>{

    try{

        const {email,password}=req.body;


        const [users] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );


        if(users.length === 0){
            return res.status(404).json({
                message:"User not found"
            });
        }


        const user = users[0];


        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if(!passwordMatch){
            return res.status(401).json({
                message:"Wrong password"
            });
        }


        const token = jwt.sign(
            {
                id:user.id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );


        res.json({
            message:"Login successful",
            token,
            user:{
                id:user.id,
                name:user.full_name,
                role:user.role
            }
        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};



module.exports={
    register,
    login
};