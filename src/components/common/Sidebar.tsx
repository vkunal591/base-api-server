"use client";

import Link from "next/link";
import { tabs } from "@/data/tabs";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RiArrowDropDownLine } from "react-icons/ri";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { token, user } = useAuth();
  const [list, showList] = useState<any>({ tab: "", list: [] });

  if (!token) return null;

  // const userPermissions = user?.permissions;
  const userPermissions = [
    {
      module: "Dashboard",
      access: {
        read: true,
        write: true,
        delete: true,
      },
    },
    {
      module: "Manage Notifications",
      access: {
        read: true,
        delete: true,
        custom: true,
      },
    },

    {
      module: "Manage Billing",
      access: {
        read: true,
        write: true,
        create: true,
        update: true,
        delete: true,
      },
    },
    {
      module: "Manage Ships",
      access: {
        read: true,
        create: true,
        invoice: true,
        write: true,
        delete: true,
      },
    },
    {
      module: "Manage Files",
      access: {
        read: true,
        create: true,
        invoice: true,
        write: true,
        delete: true,
      },
    },
  ];

  let filteredTabs: any = [];
  if (userPermissions && userPermissions.length > 0) {
    filteredTabs = tabs.filter((tab) =>
      userPermissions.some(
        (permission: any) =>
          permission?.module === tab.permission && permission?.access?.read
      )
    );
  }

  return (
    <div
      className={`fixed w-[17%] text-white bg-primary h-full overflow-y-scroll no-scrollbar`}
    >
      <div className="flex justify-center border-b border-b-secondary bg-primary w-[17%] items-center py-[11px] fixed top-0">
        <Link href={""}>
          {/* <Image
            priority
            width={150}
            height={50}
            alt="Unfazed_Logo"
            unoptimized
            src={"/assets/logo/logo.jpg"}
          /> */}
          <h1 className="text-3xl">SUD</h1>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 justify-center items-center mt-[72px] mb-40">
        {filteredTabs.map((tab: any) => {
          const Icon = tab.icon;
          return (
            <React.Fragment key={tab?.id}>
              <Link
                href={tab?.href}
                aria-label={tab?.label}
                onMouseEnter={() => {
                  if (tab?.tabs && tab?.tabs.length > 0)
                    showList({ tab: tab?.permission, list: tab?.tabs });
                }}
                className={`py-3 pl-5 mr-auto w-[95%] pr-2 text-sm cursor-pointer hover:bg-secondary transition rounded-r-full text-info flex justify-between gap-2 items-center border-primary hover:text-white ${pathname === tab?.href &&
                  "bg-secondary rounded-r-full text-white font-semibold"
                  }`}
              >
                <span className="flex gap-2 items-center">
                  <Icon size={18} /> {tab?.label}
                </span>
                {tab?.tabs && tab?.tabs.length > 0 && (
                  <RiArrowDropDownLine size={23} className="w-fit" />
                )}
              </Link>
              {list?.tab === tab?.permission && (
                <div
                  onMouseEnter={() =>
                    showList({ tab: tab?.permission, list: tab?.tabs })
                  }
                  className="flex flex-col w-full bg-secondary"
                >
                  {list?.list &&
                    list?.list.length > 0 &&
                    list?.list.map((tabChild: any, index: number) => {
                      const Icon = tabChild.icon;
                      return (
                        <Link
                          href={tabChild?.href}
                          key={`index+${index}`}
                          aria-label={tabChild?.label}
                          className="w-full text-sm text-info pl-10 gap-2 py-3 flex items-center hover:bg-secondary hover:text-white"
                        >
                          <Icon className="text-base" /> {tabChild?.label}
                        </Link>
                      );
                    })}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
