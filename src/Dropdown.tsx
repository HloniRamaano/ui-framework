// @ts-ignore
import React, {
  createContext,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Manager, Popper, Reference } from "react-popper";
import { Menu, Transition } from "@headlessui/react";
import {
  IDropdown,
  IDropdownMenuContextType,
  IMenuHeading,
  IMenuItem,
  IMenuItemContainer,
} from "./interfaces/dropdown.interface";

const DropdownMenuCtx = createContext<IDropdownMenuContextType>({
  isVisible: false,
  showDropdownMenu: () => {},
  hideDropdownMenu: () => {},
});

function useDropdownMenuCtx(
  ref: React.MutableRefObject<HTMLElement | undefined>
): IDropdownMenuContextType {
  const [isVisible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    function mouseListener(e: MouseEvent) {
      let targetAsNode: any = e.target;
      if (ref.current && !ref.current.contains(targetAsNode)) {
        setVisible(false);
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", mouseListener);
      document.addEventListener("mouseup", mouseListener);
    }

    return () => {
      document.removeEventListener("mousedown", mouseListener);
      document.removeEventListener("mouseup", mouseListener);
    };
  }, [isVisible]);

  return {
    isVisible,
    showDropdownMenu: () => setVisible(true),
    hideDropdownMenu: () => setVisible(false),
  };
}

function DropdownMenu(props: IDropdown) {
  let {
    title,
    icon,
    noBackground,
    id,
    widthClass,
    color,
    placement,
    square,
    buttonWidth,
    between,
    padding,
    borderColor,
    leftRounded,
    rightRounded,
    buttonStyle,
    onClick,
    containerRef,
  } = props;

  const popupNode = useRef<HTMLElement>();
  const ctxValue = useDropdownMenuCtx(popupNode);
  if (!placement) {
    placement = "bottom-start";
  }
  let componentPadding = "px-4";

  if (padding) {
    componentPadding = padding;
  }

  widthClass = widthClass ? widthClass : "w-72";

  color = color ? color : "gray";

  return (
    <DropdownMenuCtx.Provider value={ctxValue}>
      <Manager>
        <div
          ref={containerRef}
          className={`inline-block text-left cursor-pointer ${
            buttonWidth ? buttonWidth : ""
          }`}
        >
          <Reference>
            {({ ref }) => (
              <div
                className="rounded-full"
                ref={ref}
                onClick={() => {
                  ctxValue.showDropdownMenu();
                  onClick && onClick();
                }}
              >
                <div
                  tabIndex={0}
                  onKeyPress={(e: any) => {
                    if (e.key === "Enter") {
                      if (ctxValue.isVisible) {
                        ctxValue.hideDropdownMenu();
                      } else {
                        ctxValue.showDropdownMenu();
                      }
                    }
                  }}
                  id={id}
                  style={buttonStyle && buttonStyle}
                  className={
                    `items-center  focus:outline-none focus:ring-1 focus:ring-primary  ${
                      leftRounded
                        ? "rounded-r"
                        : rightRounded
                        ? "rounded-l"
                        : square
                        ? "rounded"
                        : "rounded-full"
                    } inline-flex ${
                      between ? "justify-between" : "justify-center"
                    } w-full ${componentPadding} font-bold  focus:outline-none ` +
                    ("text-" + color + " ") +
                    (noBackground
                      ? "my-1 py-1 hover:text-" + color + "-700 font-bold"
                      : ` py-2 hover:bg-gray-50 border-${borderColor} shadow-sm ${
                          square ? "rounded" : "rounded-full"
                        } border bg-white`)
                  }
                >
                  {icon && (
                    <div className="h-5 w-5 flex items-center">
                      <FontAwesomeIcon icon={icon} aria-hidden="true" />
                    </div>
                  )}
                  {Boolean(title) && (
                    <span className="ml-2 truncate">{title}</span>
                  )}
                  <div className="h-5 w-5 flex items-center">
                    <FontAwesomeIcon
                      icon="caret-down"
                      className={"-mr-1 ml-2 " + (title ? " mt-px" : "")}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            )}
          </Reference>
          {/* @ts-ignore */}
          <Popper
            placement={placement}
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 5],
                },
              },
            ]}
            innerRef={(node) => (popupNode.current = node)}
          >
            {({ ref, style }) =>
              ctxValue.isVisible ? (
                <div
                  onClick={(e: any) => {
                    e.stopPropagation();
                    ctxValue.hideDropdownMenu();
                  }}
                  ref={ref}
                  // @ts-ignore
                  style={{ margin: 0, ...style }}
                  className={
                    "z-50 origin-top-right absolute right-0 rounded-md shadow-lg bg-white  ring-1 ring-black ring-opacity-5  focus:outline-none m-1 " +
                    widthClass
                  }
                >
                  <Menu>{props.children}</Menu>
                </div>
              ) : null
            }
          </Popper>
        </div>
      </Manager>
    </DropdownMenuCtx.Provider>
  );
}

function ContextMenu(props: IDropdown) {
  let { id, widthClass } = props;

  widthClass = widthClass ? widthClass : "w-72";

  return (
    <Menu
      as="div"
      id={id ? id : "context_menu"}
      className="relative inline-block text-left"
    >
      <Transition
        show={true}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className={
            "z-10 origin-top-right absolute py-3 right-0 mt-2 rounded-md shadow-lg bg-white  ring-1 ring-black ring-opacity-5  focus:outline-none " +
            widthClass
          }
        >
          {props.children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function MenuItem(props: IMenuItem) {
  let { title, icon, appendHTML, id, isDisabled, isLoading, closeOnClick } =
    props;

  let iconToShow = icon;

  if (isLoading) {
    iconToShow = "sync";
  }

  return (
    <div
      id={id}
      tabIndex={0}
      className=" focus:outline-none focus:ring-1 focus:ring-primary  rounded-md mx-1"
      onKeyPress={(e: any) => {
        if (e.key === "Enter" && !isDisabled) {
          document.body.click();
          props.onClick();
        }
      }}
    >
      <Menu.Item>
        {({ active }) => (
          <div
            className={
              " group  flex items-center  px-4 py-2 cursor-pointer font-semibold " +
              (isDisabled
                ? "bg-gray-100 text-gray-500"
                : active
                ? "bg-gray-100 text-gray-900"
                : "text-black")
            }
            onClick={(e: any) => {
              if (!isDisabled) {
                if (closeOnClick) {
                  document.body.click();
                  props.onClick();
                } else {
                  e.stopPropagation();
                  document.body.click();
                  props.onClick();
                }
              }
            }}
          >
            {iconToShow && (
              <div className="h-5 w-5 mr-3 flex items-center">
                <FontAwesomeIcon
                  icon={iconToShow}
                  spin={isLoading}
                  className={
                    "  " +
                    (isDisabled
                      ? "text-gray-500"
                      : "text-black group-hover:text-gray-900")
                  }
                  aria-hidden="true"
                />
              </div>
            )}
            {title}
            <div className="ml-auto">{appendHTML}</div>
          </div>
        )}
      </Menu.Item>
    </div>
  );
}

function MenuItemContainer(props: IMenuItemContainer) {
  return <Menu.Item>{props.children}</Menu.Item>;
}

function MenuHeading(props: IMenuHeading) {
  let { title, icon, id } = props;

  return (
    <div id={id}>
      <Menu.Item>
        {() => (
          <div
            className={
              "group flex items-center  px-4 py-2 cursor-pointer font-semibold text-gray-700"
            }
          >
            {icon && (
              <div className="h-5 w-5 mr-3 flex items-center">
                <FontAwesomeIcon
                  icon={icon}
                  className=" text-gray-500 group-hover:text-gray-900"
                  aria-hidden="true"
                />
              </div>
            )}
            {title}
          </div>
        )}
      </Menu.Item>
    </div>
  );
}

DropdownMenu.defaultProps = {
  borderColor: "gray-300",
};

const Dropdown = {
  MenuItemContainer,
  MenuItem,
  MenuHeading,
  Menu: DropdownMenu,
  ContextMenu,
};

export { Dropdown };
