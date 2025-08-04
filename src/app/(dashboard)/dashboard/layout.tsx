

import { Icon, Icons } from "@/app/component/Icon";
import SignOutButton from "@/app/component/SignOutButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
  {
    id: 2,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="flex h-full w-full max-w-[16rem] flex-col gap-y-6 overflow-y-auto border-r border-gray-200 bg-white px-4 py-5 md:w-64">
        {/* Logo */}
        <Link href="/dashboard" className="flex h-14 items-center justify-start">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        {/* Chats Section */}
        <div className="text-xs font-semibold leading-6 text-gray-400">
          Your cahts
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-6">
            <li className="text-sm text-gray-500">
              // chat that user have
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="-mx-2 space-y-3">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.635rem] bg-white">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            {/* Profile Section */}
            <li className="mt-auto">
              <div className="flex items-center gap-x-5 px-3 py-3 text-base font-semibold leading-6 text-gray-900">
                <div className="relative h-10 w-10 rounded-full bg-gray-50 mr-3">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full object-cover"
                    src={session.user.image || "/default-profile.png"}
                    alt={`${session.user.name || "User"}'s profile picture`}
                  />
                </div>
                <span className="sr-only">Your profile</span>
                <div className="flex flex-col flex-1">
                  <span>{session.user.name || "User"}</span>
                  <span className="text-xs text-zinc-400">
                    {session.user.email || "No email"}
                  </span>
                </div>
                <div className="ml-auto flex items-center p-1">
                  <SignOutButton className="h-7 w-7" />
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">{children}</main>
    </div>
  );
};

export default Layout;