import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { fetchRedis } from "@/helper/redis";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const { email: emailToAdd } = addFriendValidator.parse(body);

    // Find the user by email via Redis\

    const idToAdd =  await fetchRedis('get',`user:email:${emailToAdd}`) as string

    // this is the c data reomain in cache in nextjs wierd cachiong behavious so query the databases and get the fresh data by fetchRedis helper function
    // const redisResponse = await fetch(
    //   `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    //     },
    //     cache: "no-store",
    //   }
    // );

    // const data = (await redisResponse.json()) as { result: string | null };
    // const idToAdd = data.result;

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!idToAdd) {
      return new Response("User not found", { status: 404 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    // Check if already sent friend request
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("Friend request already sent", { status: 400 });
    }

    // Check if already friends
    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyFriend) {
      return new Response("Already friends with this user", { status: 400 });
    }

    // Add to Redis set: incoming_friend_requests
    await db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("Friend request sent", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 400 });
    }

    console.error("Unexpected Error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
