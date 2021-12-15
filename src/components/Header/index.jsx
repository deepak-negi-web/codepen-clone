import React from "react";
import tw from "twin.macro";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { RiUserSettingsFill } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";
import { Menu, Button } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Avatar from "react-avatar";

import { Header } from "./styled";
import { useModal } from "../../providers";

function HeaderComp() {
  const router = useRouter();
  const { openModal } = useModal();
  const { data: session, status } = useSession();
  console.log("session", session);
  const handleClick = ({ key }) => {
    if (key === "logout") {
      signOut();
    }
  };

  return (
    <Header>
      <div tw="flex items-center w-full justify-between sm:(justify-items-start w-auto)">
        <Link href="/">
          <a
            className="gradient-text-2"
            tw="text-3xl text-white font-bold mr-4"
          >
            CodeworK
          </a>
        </Link>
        <Menu
          onClick={handleClick}
          selectedKeys={router.pathname}
          mode="horizontal"
          theme="dark"
        >
          <Menu.Item key="/editor">
            <Link href="/editor">Editor</Link>
          </Menu.Item>
          <Menu.Item key="/feeds">
            <Link href="/feeds">Feeds</Link>
          </Menu.Item>
        </Menu>
      </div>
      <div tw="flex items-center">
        {status !== "authenticated" ? (
          <Button
            type="primary"
            size="large"
            className="gradient-text-3"
            onClick={() => openModal("login")}
          >
            Log In
          </Button>
        ) : (
          <div tw="flex items-center">
            <h2 tw="text-white font-semibold text-lg">
              Hi {session?.user?.name}
            </h2>
            <Menu
              onClick={handleClick}
              selectedKeys={router.pathname}
              mode="horizontal"
              theme="dark"
              style={{
                padding: "0",
                marginLeft: "1rem",
                backgroundColor: "transparent",
              }}
            >
              <Menu.SubMenu
                key="SubMenu"
                title={
                  <Avatar
                    name={session?.user?.name}
                    email={session?.user?.email}
                    src={session.user?.image}
                    size="48"
                    round={true}
                  />
                }
                style={{
                  padding: "0",
                  borderRadius: "50%",
                }}
              >
                <Menu.Item key="setting:1">
                  <span tw="flex items-center">
                    <MdDashboardCustomize
                      size="24"
                      color="var(--tertiary-background)"
                    />
                    <span tw="ml-2 text-lg">Dashboard</span>
                  </span>
                </Menu.Item>
                <Menu.Item key="setting:2">
                  <span tw="flex items-center">
                    <RiUserSettingsFill
                      size="24"
                      color="var(--tertiary-background)"
                    />
                    <span tw="ml-2 text-lg">Profile</span>
                  </span>
                </Menu.Item>
                <Menu.Item key="logout">
                  <span tw="flex items-center">
                    <HiOutlineLogout
                      size="24"
                      color="var(--tertiary-background)"
                    />
                    <span tw="ml-2 text-lg">Log Out</span>
                  </span>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </div>
        )}
      </div>
    </Header>
  );
}

export default HeaderComp;
