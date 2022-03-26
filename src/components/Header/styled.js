import tw from "twin.macro";

export const Header = tw.header`
h-16 sticky top-0 backdrop-blur-sm padding[1rem 2rem] sm:padding[1rem 4rem]
flex items-center justify-between
 border[1px solid var(--primary-border-color)] border-l-0 border-r-0
 z-10
[ .ant-menu, .ant-menu.ant-menu-dark]:(background[var(--primary-background)] text-white  border-none)
[ .ant-menu > .ant-menu-item]:(background[var(--tertiary-background)] mr-2 last:(mr-0) hover:(background[var(--hover-background)] after:content[none]))
[ .ant-menu > .ant-menu-item > .ant-menu-title-content]:(color[rgba(255,255,255,0.65)])
[ .ant-menu, .ant-menu.ant-menu-dark > .ant-menu-item-selected]:(text-white background[var(--tertiary-background)] )
[ .ant-menu.ant-menu-dark >.ant-menu-submenu]:(after:(border-none content[none]) hover:(text-white background[var(--tertiary-background)]))
[ .ant-menu-horizontal, .ant-menu, .ant-menu-dark > .ant-menu-item::after, .ant-menu-horizontal > .ant-menu-submenu]:(after:(border-none content[none]) hover:(text-white background[var(--tertiary-background)]))

[ .ant-menu-dark >.ant-menu-submenu >.ant-menu-submenu-title]:( hover:text-white)
[.save_button]:(background[var(--tertiary-background)] mr-4 border-none hover:background[var(--hover-background)] text-white)
`;
