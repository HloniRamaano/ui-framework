// @ts-ignore
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import {
  IInstructionProps,
  IMessageProps,
} from "./interfaces/message.interface";

interface IBaseMessageProps extends IMessageProps {
  variant: string;
}

// Implementation
function Success(props: IMessageProps) {
  return <BaseMessage {...props} variant="success" />;
}

function Error(props: IMessageProps) {
  return <BaseMessage {...props} variant="error" />;
}

function Warning(props: IMessageProps) {
  return <BaseMessage {...props} variant="warning" />;
}

function Info(props: IMessageProps) {
  return <BaseMessage {...props} variant="info" />;
}

function Instruction(props: IInstructionProps) {
  const { className = "", noPadding, isCenter } = props;

  return (
    <p
      className={`${noPadding ? "" : " py-3 "} 
      ${isCenter ? " text-center " : ""} 
      ${className}`}
    >
      {props.children}
    </p>
  );
}

function BaseMessage(props: IBaseMessageProps) {
  const { children, variant, noPadding, showShadow, showCloseButton } = props;
  const [show, setShow] = useState<boolean>(true);

  let color = "black";
  let icon: IconProp | undefined;

  switch (variant) {
    case "success":
      color = "green";
      icon = "check-circle";
      break;
    case "error":
      color = "red";
      icon = "times-circle";
      break;
    case "warning":
      color = "yellow";
      icon = "exclamation-circle";
      break;
    case "info":
      color = "blue";
      break;
    default:
      break;
  }

  const border = variant === "info" ? "" : `border border-${color}-200`;
  const textStyle = variant === "info" ? "text-black" : `text-${color}-700`;
  const iconStyle = variant === "info" ? "text-black" : `text-${color}-400`;

  return (
    <>
      {show && (
        <div
          className={`rounded-md 
            ${border} 
            bg-${color}-50 
            ${noPadding ? "" : " p-4 my-4 "} 
            ${showShadow ? " shadow-lg " : ""}`}
        >
          <div className="flex justify-between items-center">
            <div className=" flex items-center ">
              {icon && (
                <FontAwesomeIcon
                  className={`mr-3 h-5 w-5 ${iconStyle}`}
                  aria-hidden="true"
                  icon={icon}
                />
              )}
              <div>
                <div className={textStyle}>{children}</div>
              </div>
            </div>
            {showCloseButton && (
              <FontAwesomeIcon
                icon="times"
                className={`${iconStyle} cursor-pointer`}
                onClick={() => setShow(!show)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

const Message = {
  Success,
  Warning,
  Error,
  Info,
  Instruction,
};

export { Message };
