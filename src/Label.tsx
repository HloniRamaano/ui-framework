// @ts-ignore
import React from "react";
import { InfoButton } from "./InfoButton";
import { ILabel, ILabelWithValue } from "./interfaces/label.interface";

// Implementation
function Label(props: ILabel) {
  const {
    children,
    htmlFor,
    className = "",
    noMargin,
    labelColor = "text-gray-900",
  } = props;

  return (
    <label
      htmlFor={htmlFor}
      className={`font-semibold mr-2 flex items-center text-left 
        ${noMargin ? "" : " mb-2 "} ${className} ${labelColor}`}
    >
      {children}
    </label>
  );
}

function LabelWithValue(props: ILabelWithValue) {
  const {
    label,
    value,
    noMargin,
    info,
    labelColor = "text-gray-900",
    doNotShowEnDash,
    dataTest,
  } = props;

  return (
    <div
      className={`flex flex-row items-center flex-wrap 
        ${noMargin ? "" : " mb-2 pt-2"}`}
    >
      <label
        className={`font-semibold mr-2 flex items-center text-left self-baseline 
        ${labelColor}}`}
      >
        {label}
      </label>
      <div className="ml-2 text-left" data-test={dataTest}>
        {doNotShowEnDash
          ? value
          : value !== undefined && value !== ""
          ? value
          : "–"}
      </div>
      {info && (
        <div>
          <InfoButton>{info}</InfoButton>
        </div>
      )}
    </div>
  );
}

export { Label, LabelWithValue };
