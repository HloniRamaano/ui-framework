// @ts-ignore
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IInput } from "./interfaces/input.interface";
import { InfoButton } from "./InfoButton";
import { Label } from "./Label";
import { Message } from "./Message";
import { Select } from "./Select";
import { useState } from "react";

function Input(props: IInput) {
  const {
    label,
    htmlFor,
    labelClassName = "",
    inputFieldID,
    isReadOnly,
    inputFieldStyle,
    placeholder,
    register,
    reference,
    type = "text",
    name,
    defaultValue,
    value,
    validationError,
    inputID,
    appendIcon,
    appendText,
    appendPadding,
    appendIconId,
    onAppendIconClick,
    appendIconColor = "text-primary",
    isOptional,
    isDisabled,
    errorMessage,
    onChange = () => {},
    onClick = () => {},
    onFocus = () => {},
    prependText,
    prependTextHasBackground,
    appendTextHasBackground,
    prependTextContainerClassName = "",
    appendTextContainerClassName = "",
    prependPadding,
    onBlur = () => {},
    containerClassName,
    isLabelInline,
    shouldOverlapLabel,
    shouldAutoFocus,
    onKeyPress = () => {},
    onKeyUp = () => {},
    onKeyDown = () => {},
    step,
    min,
    max,
    maxLength,
    autoComplete,
    info,
    appendSelectProps,
    inputClassName,
    onClearSearch,
    prependSelectProps,
    prependTextSize = "sm:text-sm",
    showAsterisk,
    hideArrows,
    disableNumericInputScroll,
    pointer,
    dataTest,
    inputMode,
  } = props;

  const [isFocussed, setIsFocussed] = useState<boolean>(false);

  // @ts-ignore

  let inputClasses = `${
    prependPadding ? prependPadding : prependText ? " pl-7 " : ""
  }`;

  if (inputClassName) {
    inputClasses = inputClasses + inputClassName;
  }

  if (appendPadding) {
    inputClasses += ` ${appendPadding} `;
  } else if (appendIcon || appendText || onClearSearch) {
    if (onClearSearch) {
      inputClasses += " pr-20";
    } else if (appendText && appendText.length > 4) {
      inputClasses += " pr-20";
    } else {
      inputClasses += " pr-12";
    }
  }

  const InputElement = (
    <input
      autoFocus={shouldAutoFocus}
      name={name}
      ref={reference ? (r: any) => reference(r) : register}
      type={type}
      defaultValue={defaultValue}
      value={value}
      id={inputID}
      readOnly={isDisabled || isReadOnly} // If we make the input isDisabled then react-hooks-form doesn't submit the defaultValue https://twitter.com/bluebill1049/status/1300231640392716288
      onChange={onChange}
      onClick={(e) => {
        onClick(e);
      }}
      onFocus={(e: any) => {
        if (!isDisabled) {
          setIsFocussed(true);
          e.target.placeholder = "";
          onFocus(e);
        }
      }}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onBlur={(e: any) => {
        setIsFocussed(false);

        if (!isDisabled) {
          if (placeholder) {
            e.target.placeholder = placeholder;
          }
          onBlur(e);
        }
      }}
      step={step}
      min={min}
      max={max}
      maxLength={maxLength}
      autoComplete={
        autoComplete === "off" ? "something-chrome-does-not-know" : autoComplete
      } // Setting autoComplete to off is not reliable
      className={`focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent shadow-sm block w-full border-gray-300 rounded-md 
        ${inputClasses} 
        ${isDisabled ? " bg-gray-100" : ""} 
        ${pointer ? " cursor-pointer" : ""} 
        ${shouldOverlapLabel ? " h-14" : ""}`}
      onWheel={(e: any) => {
        if (disableNumericInputScroll) {
          e.target.blur();
        }
      }}
      data-test={dataTest}
      inputMode={inputMode ?? (type === "number" ? "decimal" : "text")}
    />
  );

  function renderLabel() {
    return (
      <Label
        htmlFor={htmlFor}
        className={labelClassName}
        noMargin={isLabelInline}
      >
        <span className="inline-block whitespace-nowrap">
          {label}
          {showAsterisk && " *"}
        </span>
        {info && <InfoButton>{info}</InfoButton>}
      </Label>
    );
  }

  function renderPrependSelect() {
    return (
      <div className="-mr-2 z-10">
        <Select
          {...prependSelectProps}
          noMargin
          isDisabled={isDisabled}
          shouldOverlapLabel={shouldOverlapLabel}
        />
      </div>
    );
  }

  function renderOverlappingLabel() {
    return (
      <div className="absolute -top-2 left-2 inline-block px-1 text-xs font-medium text-gray-900">
        <div className="flex flex-row space-x-2 px-2">
          {renderLabel()}
          {isOptional && (
            <span className="text-gray-500">
              {typeof isOptional === "string" ? isOptional : "(Optional)"}
            </span>
          )}
        </div>

        <div
          className={`bg-white h-2 -mt-4 ${
            isFocussed ? "ring-1 ring-white" : ""
          }`}
        ></div>
      </div>
    );
  }

  function renderPrependText() {
    return (
      <div
        className={
          "text-gray-500 absolute inset-y-0 left-0 pl-3 items-center flex flex-row " +
          (onAppendIconClick ? "" : " pointer-events-none ") +
          prependTextContainerClassName +
          (prependTextHasBackground
            ? " bg-primary-100 px-4 rounded-l-lg border-t border-l border-b text-primary font-bold " +
              (isFocussed ? "border-primary-100" : " border-gray-300")
            : "")
        }
      >
        <span className={prependTextSize}>{prependText}</span>
      </div>
    );
  }

  function renderAppendIcon() {
    return (
      <div className={"absolute inset-y-0 right-0 mr-3 flex items-center"}>
        {appendIcon && (
          <div
            className={
              onAppendIconClick
                ? " cursor-pointer " + appendIconColor
                : " pointer-events-none text-gray-400"
            }
            id={appendIconId}
            onClick={(e) => {
              if (onAppendIconClick) {
                onAppendIconClick(e);
              }
            }}
          >
            <FontAwesomeIcon icon={appendIcon} size="sm" />
          </div>
        )}
        {appendIcon && onClearSearch && (
          <div className="mx-2 pointer-events-none text-gray-200">|</div>
        )}
        {onClearSearch && (
          <div
            title="Clear search"
            className="cursor-pointer text-gray-400 "
            onClick={() => {
              if (onClearSearch) {
                onClearSearch();
              }
            }}
          >
            <FontAwesomeIcon icon={"times"} size="sm" />
          </div>
        )}
      </div>
    );
  }

  function renderAppendText() {
    return (
      <div
        className={
          "absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 pointer-events-none " +
          appendTextContainerClassName +
          (appendTextHasBackground
            ? " bg-primary-100 px-4 rounded-r-lg border-t border-r border-b text-primary font-bold " +
              (isFocussed ? "border-primary-100" : " border-gray-300")
            : "")
        }
      >
        {appendText}
      </div>
    );
  }

  function renderAppendSelect() {
    return (
      <div className="-ml-2">
        <Select {...appendSelectProps} noMargin isDisabled={isDisabled} />
      </div>
    );
  }

  function renderValidationError() {
    return (
      <>
        {validationError &&
          (errorMessage ? (
            <Message.Error>{errorMessage}</Message.Error>
          ) : (
            <Message.Error>{validationError.message}</Message.Error>
          ))}
      </>
    );
  }

  function render() {
    return (
      <div
        className={
          (hideArrows ? " no-arrows " : "") +
          (containerClassName
            ? containerClassName
            : isLabelInline
            ? "flex items-center flex-row space-x-4"
            : "mt-4 max-w-sm")
        }
      >
        {label && label !== "" && (
          <div className="flex justify-between">
            {!shouldOverlapLabel && renderLabel()}
            {isOptional && !shouldOverlapLabel && (
              <span className="text-gray-500">
                {typeof isOptional === "string" ? isOptional : "(Optional)"}
              </span>
            )}
          </div>
        )}
        <div
          className="flex items-center flex-row w-full"
          id={inputFieldID}
          style={inputFieldStyle}
        >
          {prependSelectProps && renderPrependSelect()}
          <div className={"relative rounded-m w-full"}>
            {shouldOverlapLabel && label && renderOverlappingLabel()}
            {prependText && renderPrependText()}

            {InputElement}
            {/* @ts-ignore */}
            {(appendIcon || onClearSearch) && renderAppendIcon()}
            {appendText && renderAppendText()}
          </div>
          {appendSelectProps && renderAppendSelect()}
        </div>
        {renderValidationError()}
      </div>
    );
  }

  return render();
}

export { Input };
