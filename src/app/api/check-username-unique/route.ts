'use client'
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/user.model"
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema"
import mongoose from "mongoose"


const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET (request:Request){
    
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }

        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)

        if(!result.success){
            const userNameErrors = result.error.format()
            .username?._errors || []

            return Response.json({
                message:userNameErrors?.length > 0
                ? userNameErrors.join(', ')
                : "Invalid query parameters",
                success:false,
            },{status:400})
        }

        const {username} = result.data

        const existingVerifiedUser = UserModel.findOne({
            username,
            isVerified:true,
        })

        if(existingVerifiedUser){
            return Response.json({
                message: "Username is already taken",
                success:false,
            },{status:400})
        }

        return Response.json({
            message: "Username is unique",
            success:true,
        },{status:400})

    } catch (error) {
        console.error('Error checking username',error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
}