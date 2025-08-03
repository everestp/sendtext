import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface pageProps {
    
}
 
const page = async () => {
    const session = await getServerSession(authOptions)
    return ( 
        <pre>
            Hello worls = THis is the session value
            {JSON.stringify(session)}
        </pre>
     );
}
 
export default page;