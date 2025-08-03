import { addFriendValidator } from "@/lib/validations/add-friend"

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Parse the entire body
    const { email: emailToAdd } = addFriendValidator.parse(body);

    // ✅ Fetch user data from Upstash Redis
    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: 'no-store',
      }
    );

    const data = await RESTResponse.json();
console.log(data)
    if (!data.result) {
      return new Response("User not found", { status: 404 });
    }

    console.log("User data:", data.result);

    return new Response("Friend request sent", { status: 200 });

  } catch (error) {
    console.error("This is the error", error);

    return new Response("Internal Server Error", { status: 500 });
  }
}
