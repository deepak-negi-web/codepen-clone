import React from "react";
import tw from "twin.macro";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { RiUserSettingsFill } from "react-icons/ri";
import { MdDashboardCustomize, MdOutlineModeEditOutline } from "react-icons/md";
import { Menu, Button } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Avatar from "react-avatar";

import { Header } from "./styled";
import { useModal, useEditorConfig } from "../../providers";

function HeaderComp() {
  const router = useRouter();
  const { openModal } = useModal();
  const {
    showSaveButton,
    isSaving,
    isEditingWorkName,
    setShowSaveButton,
    saveUserWorkHandler,
    updateWorkHandler,
    setIsEditingWorkName,
    editWorkName,
    currentWorkName,
  } = useEditorConfig();
  const { data: session, status } = useSession();

  // handler for the menu in the header
  const handleClick = ({ key }) => {
    if (key === "logout") {
      signOut();
    } else {
      router.push(key);
    }
  };

  const onEditSave = () => {
    setIsEditingWorkName(false);
    updateWorkHandler({
      label: currentWorkName,
    });
  };

  const onEditButtonClickHandler = () => {
    setIsEditingWorkName(true);
  };

  // show the save button only on the editor page
  React.useEffect(() => {
    if (router.pathname.includes("editor")) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  }, [router.pathname]);

  return (
    <Header>
      <div tw=" flex items-center w-full justify-between sm:(justify-items-start w-auto)">
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
      {showSaveButton && (
        <div className="group" tw="flex flex-1 items-center justify-center">
          {isEditingWorkName ? (
            <input
              type="text"
              value={currentWorkName}
              autoFocus={true}
              onChange={(e) => editWorkName(e.target.value)}
              tw="p-1 w-max bg-transparent text-white font-bold truncate outline-none"
              onBlur={onEditSave}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  onEditSave();
                }
              }}
            />
          ) : (
            <span tw="text-white font-bold truncate">
              {currentWorkName || "Untitled"}
            </span>
          )}
          {!isEditingWorkName && (
            <MdOutlineModeEditOutline
              size="18"
              color="#fff"
              tw="ml-2 group-hover:( cursor-pointer animation[shake 0.97s cubic-bezier(0.36, 0.07, 0.19, 0.97) both]) "
              onClick={onEditButtonClickHandler}
            />
          )}
        </div>
      )}
      <div tw="flex items-center">
        {showSaveButton && (
          <Button
            type="primary"
            size="large"
            className="save_button"
            onClick={async () => await saveUserWorkHandler()}
          >
            {isSaving ? "Saving" : "Save"}
          </Button>
        )}
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
            <h2 tw="text-white font-semibold text-lg hidden md:(block)">
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
                <Menu.Item key="/dashboard">
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
