import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";

function getGoogleCrendtials(){
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    if (!clientId || clientId.length === 0){
        throw new Error("Missing GOOGLE_CLIENT_ID")
    }
     if (!clientSecret || clientSecret.length === 0){
        throw new Error("Missing GOOGLE_CLIENT_SECRET")
    }

    return {clientId ,clientSecret}
}
export const authOptions :NextAuthOptions = {
    adapter :UpstashRedisAdapter(db),
    session :{
        strategy :'jwt'
    },
    pages :{
    signIn :'/login'
    },
    providers :[
        GoogleProvider({
clientId: getGoogleCrendtials().clientId,
clientSecret:getGoogleCrendtials().clientSecret
        })
    ],
    callbacks :{
        async jwt({token ,user}){
const dbUser = (await db.get(`user:${token.id}`)) as User | null

if(!dbUser){
    token.id =user!.id
    return token

}
return {
    id :dbUser.name,
    name :dbUser.name,
    email:dbUser.email
    picture:dbUser.image
}
        }
        async session({session ,token}){
            if(token){
                session.user.id  = token.id
            }
        }
    }
}