// @ts-ignore
import React from "react";
import { Label } from "./Label";
import { IRadioButton, IRadioGroup } from "./interfaces/radioButton.interface";

function Button(props: IRadioButton) {
  const {
    label,
    onChange,
    isDisabled,
    labelClassName = "",
    className = "",
    labelLeft,
    labelRight,
    name,
    isChecked,
  } = props;

  function selectOption() {
    var list = document.querySelectorAll(`input[name='${name}']`);
    list.forEach((item: any) => {
      if (item.value === label) {
        item.checked = true;
        if (onChange) {
          onChange(item.value);
        }
      } else {
        item.checked = false;
      }
    });
  }

  function renderLabel(option: string) {
    const disabledClass = isDisabled
      ? "text-gray-500 "
      : "text-base cursor-pointer ";
    return (
      <label
        onClick={() => {
          selectOption();
        }}
        className={`${disabledClass} flex items-center ${labelClassName}`}
      >
        {option}
      </label>
    );
  }

  const marginClass = labelLeft ? "ml-2 " : "mr-2 ";
  const disabledClass = isDisabled
    ? "text-gray-500 "
    : "text-primary hover:border-primary ";
  return (
    <div className="flex items-start">
      <label className="inline-flex items-center">
        {label &&
          (labelLeft || (!labelLeft && !labelRight)) &&
          renderLabel(label)}
        <input
          type="radio"
          className={`${marginClass} cursor-pointer form-radio  focus:outline-none focus:ring-1 focus:ring-primary  ${disabledClass} border-gray-300 ${className} `}
          disabled={isDisabled}
          id={label}
          name={name}
          value={label}
          checked={isChecked}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
        />
        {label && labelRight && renderLabel(label)}
      </label>
    </div>
  );
}

function Group(props: IRadioGroup) {
  let {
    title,
    options,
    onChange,
    isDisabled,
    labelClassName,
    className,
    labelLeft,
    labelRight,
    name,
  } = props;
  return (
    <div className="">
      {title && <Label>{title}</Label>}
      <div className={(title ? "ml-2 " : "") + "mt-2  " + className}>
        {options.map((option, i) => {
          return (
            <div className="mt-2" key={i}>
              <Button
                name={name}
                labelClassName={labelClassName}
                isDisabled={isDisabled}
                labelLeft={labelLeft}
                labelRight={labelRight}
                label={option}
                onChange={(value: boolean) => {
                  onChange(value);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Radio = {
  Button,
  Group,
};

export { Radio };
