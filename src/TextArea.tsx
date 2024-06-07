// @ts-ignore
import React from "react";
import { InfoButton } from "./InfoButton";
import { Label } from "./Label";
import { Message } from "./Message";
import { ITextArea } from "./interfaces/textArea.interface";

const defaultContainerClass = "mt-3";

function TextArea(props: ITextArea) {
  let {
    containerClassName,
    fieldID,
    label,
    labelClassName,
    info,
    id,
    value,
    defaultValue,
    name,
    register,
    placeholder,
    validationError,
    onChange,
    onFocus,
    onBlur,
    infoButton,
    errorMessage,
    rows,
    isOptional,
    isDisabled,
    maxLength,
    dataTest,
  } = props;

  return (
    //  @ts-ignore
    <div
      className={
        containerClassName ? containerClassName : defaultContainerClass
      }
      id={fieldID}
    >
      <div className="flex justify-between">
        {label && (
          <div className="mt-1">
            <Label className={labelClassName} noMargin>
              {label} {info && <InfoButton>{info}</InfoButton>}
            </Label>
          </div>
        )}
        {isOptional && <span className="text-gray-500">(Optional)</span>}
      </div>
      <textarea
        className={
          "focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent mt-2 shadow-sm block w-full border border-gray-300 rounded-md" +
          (isDisabled ? " bg-gray-100" : "")
        }
        id={id}
        value={value}
        rows={rows ? rows : 4}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={isDisabled}
        ref={register}
        maxLength={maxLength}
        data-test={dataTest}
      />
      {validationError &&
        (errorMessage && validationError.type === "required" ? (
          <Message.Error>{errorMessage}</Message.Error>
        ) : (
          <Message.Error>{validationError.message}</Message.Error>
        ))}
      {infoButton && { infoButton }}
    </div>
  );
}

export { TextArea };
