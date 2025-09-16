import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  SquarePen,
  X,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
  Users,
  House,
  LogOut,
} from "lucide-react";
const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];
const Sidebar = ({ sidebar, setSidebar }) => {
  const user = useUser();
  const { signOut, openUserProfile } = useClerk();
  console.log(user);
  console.log(user.user.fullName);
  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-tranaslate-x-full'} transition-all duration-300 ease-in-out">
      <div className="my-7 w-full">
        <img
          src={user.user.imageUrl}
          alt="User avatarx"
          className="w-13 rounded-full mx-auto"
        />
        <div className="mt-1 text-center">
          <h1>{user.user.fullName}</h1>
          <div className="px-3 mt-5 text-sm font-medium text-gray-700">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/ai"}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                    isActive
                      ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                      : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : ""}`}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center jusetify-between ">
        <div
          onClick={() => openUserProfile()}
          className="flex gap-2 items-center cursor-pointer "
        >
          <img
            src={user.user.imageUrl}
            alt="image photo"
            className="w-8 rounded-full"
          />
          <div>
            <h1 className="text-sm font-medium">{user.user.fullName}</h1>
            {/* <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
              Plan
            </p> */}
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer mx-auto"
        />
      </div>
    </div>
  );
};

export default Sidebar;
