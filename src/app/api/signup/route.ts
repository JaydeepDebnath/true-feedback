import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcryptjs from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST (request:Request){
    await dbConnect()
    try {
        const {username,email,password,fullname}  = await request.json()
        const existingUserVerifyedByUsername = await UserModel.findOne({
            username,
            isVerified:true,
        })

        if(existingUserVerifyedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random()
        *900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                      success: false,
                      message: 'User already exists with this email',
                    },
                    { status: 400 }
                  ); 
            }else{
                const hashedPassword = await bcryptjs.hash(password, 12);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }else{
           const hashedPassword =  await bcryptjs.hash(password,12)
           const expiryDate = new Date()
           expiryDate.setHours(expiryDate.getHours() + 1)

           const newUer = new UserModel({
            username,
            fullname,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages:[] 
           })

           await newUer.save()
        }

        // send verification email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status: 500})
        }

        return Response.json({
            success:true,
            message:"User registered successfully. Verify your email",
        },{status: 201})

    } catch (error) {
        console.error('Error registering user',error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}
