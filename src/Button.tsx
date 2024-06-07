// @ts-ignore
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link as RouterLink } from "react-router-dom";
import {
  IButtonBaseProps,
  IButtonProps,
  IButtonsPanelProps,
  ILinkBaseProps,
  ILinkProps,
} from "./interfaces/button.interface";

// Implementation
function Primary(props: IButtonProps) {
  let bgColor = props.bgColor ? props.bgColor : "primary";

  return (
    <BaseButton
      {...props}
      buttonTypeClassNames={
        "focus:outline-none focus:ring-1 focus:ring-primary  inline-flex justify-center items-center px-5 py-2 border leading-4 font-medium rounded-full shadow-sm focus: outline-none border-transparent text-white bg-" +
        bgColor +
        " hover:bg-" +
        bgColor +
        "-dark"
      }
      type="submit"
    />
  );
}

function Secondary(props: IButtonProps) {
  let bgColor = props.bgColor ? props.bgColor : "primary";

  return (
    <BaseButton
      {...props}
      buttonTypeClassNames={
        " focus:outline-none focus:ring-1 focus:ring-primary   inline-flex justify-center items-center px-5 py-2 border leading-4 font-medium rounded-full shadow-sm focus: outline-none  border-" +
        bgColor +
        " text-" +
        bgColor +
        " bg-white hover:bg-" +
        bgColor +
        " hover:text-white "
      }
    />
  );
}

function Tertiary(props: IButtonProps) {
  return (
    <BaseButton
      {...props}
      buttonTypeClassNames={
        " focus:outline-none focus:ring-1 focus:ring-primary   inline-flex justify-center items-center px-5 py-2 border leading-4 font-medium rounded-full shadow-sm focus: outline-none  border-gray-900 text-gray-99 bg-white hover:text-primary hover:border-primary "
      }
    />
  );
}

function Danger(props: IButtonProps) {
  return (
    <BaseButton
      {...props}
      buttonTypeClassNames={
        "focus:outline-none focus:ring-1 focus:ring-red  inline-flex justify-center items-center px-5 py-2 border leading-4 font-medium rounded-full shadow-sm focus: outline-none  border-transparent text-white bg-red hover:bg-red-dark "
      }
    />
  );
}

function Icon(props: IButtonProps) {
  let bgColor = props.bgColor ? props.bgColor : "transparent";
  let color = props.bgColor ? "white" : "gray";

  return (
    <BaseButton
      {...props}
      iconSize={props.iconSize ? props.iconSize : "lg"}
      buttonTypeClassNames={
        " focus:outline-none focus:ring-1 focus:ring-primary   inline-flex justify-center items-center px-5 py-2 border leading-4 font-medium rounded-full shadow-sm focus: outline-none  border-transparent text-" +
        color +
        " bg-" +
        bgColor +
        " hover:bg-" +
        bgColor +
        "-dark hover:text-" +
        color +
        "-700"
      }
    />
  );
}

function Cancel(props: IButtonProps) {
  let title = props.title ? props.title : "Cancel";
  return (
    <BaseButton
      {...props}
      title={title}
      buttonTypeClassNames={
        " focus:outline-none focus:ring-1 focus:ring-primary   inline-flex justify-center items-center px-5 py-2 border leading-4 font-medium rounded-full shadow-sm focus: outline-none  justify-center border-gray-300 text-gray-700 bg-white hover:bg-gray-50 "
      }
    />
  );
}

function Link(props: ILinkProps) {
  return <BaseLink {...props} color={props.color ? props.color : "primary"} />;
}

function LinkDanger(props: ILinkProps) {
  return <BaseLink {...props} color="red" />;
}

function BaseLink(props: ILinkBaseProps) {
  const linkClassNames =
    "inline-flex items-center text-" +
    props.color +
    " font-bold hover:text-" +
    props.color +
    "-dark focus:outline-none justify-center focus:underline " +
    (props.small ? " text-xs " : " ") +
    (props.noPadding ? "" : " px-3 py-1 ");

  if (props.to) {
    if (props.target === "_blank") {
      return (
        <a href={props.to} target="_blank" rel="noopener noreferrer">
          <BaseButton {...props} buttonTypeClassNames={linkClassNames} />
        </a>
      );
    }
    return (
      <RouterLink to={props.to} tabIndex={props.tabIndex}>
        <BaseButton {...props} buttonTypeClassNames={linkClassNames} />
      </RouterLink>
    );
  } else {
    return <BaseButton {...props} buttonTypeClassNames={linkClassNames} />;
  }
}

function BaseButton(props: IButtonBaseProps) {
  let {
    isLoading,
    loadingTitle,
    icon,
    title,
    isCenter,
    buttonTypeClassNames,
    className,
    isDisabled,
    type,
    id,
    iconSize,
    hoverTitle,
    leftRounded,
    rightRounded,
    iconClassName = "mr-3",
    color,
  } = props;

  let disabledOrLoading = isDisabled || isLoading;

  let iconToShow = icon;
  let iconClass = "";

  if (isLoading) {
    iconToShow = "sync";
    iconClass = " button-loader-spinning";
  }

  if (color) {
    iconClass += ` text-${color}`;
  }
  let textToShow = isLoading && loadingTitle ? loadingTitle + "..." : title;

  return (
    <button
      id={id}
      disabled={disabledOrLoading}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e);
        }
      }}
      tabIndex={props.tabIndex ?? 0}
      type={type ? type : "button"}
      title={hoverTitle}
      className={
        "button " +
        (leftRounded
          ? "rounded-r h-12 md:h-9 "
          : rightRounded
          ? "rounded-l h-12 md:h-9 "
          : "rounded-full h-12 md:h-9 ") +
        buttonTypeClassNames +
        " items-center " +
        (isCenter ? " block mx-auto " : "") +
        (className ? className : "") +
        (disabledOrLoading ? " opacity-50 pointer-events-none" : "")
      }
    >
      {iconToShow && (
        <FontAwesomeIcon
          icon={iconToShow}
          className={(textToShow ? iconClassName : "") + iconClass}
          size={iconSize ? iconSize : "sm"}
        />
      )}
      <div className={color ? `text-${color}` : ""}>{textToShow}</div>
    </button>
  );
}

function ButtonsPanel(props: IButtonsPanelProps) {
  let { noMargin, children, isCenter, isLeft } = props;
  let align = "justify-between";

  let nonEmptyChildren = [];

  if (Array.isArray(children)) {
    nonEmptyChildren = children.filter((child: any) => {
      return child;
    });
  }

  if (!Array.isArray(children) || nonEmptyChildren.length === 1) {
    align = "justify-end";
  }

  if (isCenter) {
    align = "justify-center";
  }

  if (isLeft) {
    align = "justify-start";
  }

  return (
    <div
      className={
        " w-full  flex flex-col-reverse sm:flex-row space-y-4 sm:space-y-0 space-y-reverse space-x-0 sm:space-x-4  " +
        align +
        (noMargin ? "" : " mt-6 mb-1")
      }
    >
      {children}
    </div>
  );
}

function Download(props: {
  isDownloading: boolean;
  download: any;
  downloadType: string;
  isDisabled?: boolean;
  shouldHideTitle?: boolean;
}) {
  return (
    <Button.Link
      isDisabled={props.isDisabled}
      onClick={() => props.download()}
      icon="download"
      isLoading={props.isDownloading}
      title={props.shouldHideTitle ? "" : "Download " + props.downloadType}
      loadingTitle={
        props.shouldHideTitle ? "" : "Download " + props.downloadType
      }
    />
  );
}

function Close(props: IButtonProps) {
  return (
    // @ts-ignore
    <div className="text-lg leading-6 font-bold  text-gray-900" {...props}>
      <FontAwesomeIcon
        icon="times"
        size="sm"
        className="float-right cursor-pointer hover:text-gray-900 text-gray-700"
      />
    </div>
  );
}

const Button = {
  Primary,
  Secondary,
  Tertiary,
  Danger,
  Cancel,
  Link,
  LinkDanger,
  ButtonsPanel,
  Icon,
  Download,
  Close,
};

export { Button };
