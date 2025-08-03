import { db } from "@/lib/db";
import Image from "next/image";
import Button from "./component/ui/Button";

export default async function Home() {
  await db.set("EVerst","hello")
  return (
  <Button> HEllo</Button>
  );
}
