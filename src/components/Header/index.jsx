import React from "react";
import tw from "twin.macro";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { RiUserSettingsFill } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";
import { Menu, Button } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";

import { useModal } from "../../providers";

import { Header } from "./styled";

function HeaderComp() {
  const router = useRouter();
  const { openModal } = useModal();
  const handleClick = (e) => {
    console.log("click ", e);
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
        <Button
          type="primary"
          size="large"
          className="gradient-text-3"
          onClick={() => openModal("login")}
        >
          Log In
        </Button>
        <Menu
          onClick={handleClick}
          selectedKeys={router.pathname}
          mode="horizontal"
          theme="dark"
          style={{
            padding: "0",
            marginLeft: "1rem",
          }}
        >
          <Menu.SubMenu
            key="SubMenu"
            title={<FaUserAstronaut size="32" color="#fff" />}
            style={{
              padding: "0",
            }}
          >
            <Menu.Item key="setting:1">
              <span tw="flex items-center">
                <MdDashboardCustomize
                  size="24"
                  color="var(--tertiary-background)"
                />
                <span tw="ml-2">Dashboard</span>
              </span>
            </Menu.Item>
            <Menu.Item key="setting:2">
              <span tw="flex items-center">
                <RiUserSettingsFill
                  size="24"
                  color="var(--tertiary-background)"
                />
                <span tw="ml-2">Profile</span>
              </span>
            </Menu.Item>
            <Menu.Item key="setting:3">
              <span tw="flex items-center">
                <HiOutlineLogout size="24" color="var(--tertiary-background)" />
                <span tw="ml-2">Log Out</span>
              </span>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div>
    </Header>
  );
}

export default HeaderComp;
