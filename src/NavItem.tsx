// @ts-ignore
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface INavItem {
  path: string;
  displayName: string;
  icon: IconProp;
}

interface IProps {
  item: INavItem;
  isNavbarCollapsed: boolean;
}

function NavItem(props: IProps) {
  const { item } = props;

  const isLinkActive = window.location.pathname.indexOf(item.path) >= 0;
  let bgClass = isLinkActive ? "bg-gray-100 font-semibold" : "";

  return (
    <div
      id={"nav_" + item.displayName.replaceAll(" ", "_").toLowerCase()}
      className={`nav-item text-gray-700 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-2 py-1.5 rounded-md mb-1 ${bgClass}`}
    >
      <div className="w-4 mr-2 text-center">
        <FontAwesomeIcon icon={item.icon} size="xs" />
      </div>
      {props.isNavbarCollapsed ? " " : item.displayName}

      {props.isNavbarCollapsed && (
        <div className="absolute nav-item-popover z-50 bg-white rounded-md text-gray-700 border border-gray-100 shadow-md">
          <strong className="nav-item-text p-4 ">{item.displayName}</strong>
        </div>
      )}
    </div>
  );
}

function NavItemDivider() {
  return <hr className="border-0 bg-gray-200 h-px my-2" />;
}

export { NavItem, NavItemDivider };
