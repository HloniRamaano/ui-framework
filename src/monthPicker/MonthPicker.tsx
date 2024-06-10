import moment from "moment";
// @ts-ignore
import React, { ReactNode, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "../Input";
import { Manager, Popper, Reference } from "react-popper";
import { MonthPickerCtx, useMonthPickerCtx } from "./MonthPickerContext";

interface IMonthPicker {
  dateFrom: Date;
  label?: ReactNode;
  isLabelInline?: boolean;
  placeholder?: string;
  containerClassName?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: Date) => void;
  onMonthPickerClose?: Function;
  isDisabled?: boolean;
  dataTest?: string;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const inputStyle = {
  paddingTop: "0.375rem",
  paddingBottom: "0.375rem",
};

function MonthPicker(props: IMonthPicker) {
  const {
    dateFrom,
    label,
    isLabelInline,
    placeholder,
    containerClassName,
    onChange,
    onMonthPickerClose,
    isDisabled,
    minDate,
    maxDate,
    dataTest,
  } = props;

  let date = new Date();
  if (dateFrom) {
    date = moment(dateFrom).toDate();
  }

  const popupNode = useRef<HTMLElement>();
  const ctxValue = useMonthPickerCtx(
    date,
    onChange,
    onMonthPickerClose,
    popupNode,
    minDate,
    maxDate
  );

  return (
    <MonthPickerCtx.Provider
      value={ctxValue}
      key={ctxValue.isVisible.toString()}
    >
      {/* @ts-ignore */}
      <Manager>
        {/* @ts-ignore */}
        <Reference>
          {({ ref }) => (
            <div className="pointer">
              <Input
                reference={ref}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    ctxValue.toggleCalendar();
                  }
                }}
                onClick={() => {
                  ctxValue.toggleCalendar();
                }}
                value={dateFrom ? moment(date).format("MMMM YYYY") : ""}
                isReadOnly
                label={label}
                dataTest={dataTest}
                isLabelInline={isLabelInline}
                containerClassName={containerClassName}
                placeholder={placeholder}
                appendIcon={
                  isDisabled
                    ? undefined
                    : ctxValue.isVisible
                    ? "caret-up"
                    : "caret-down"
                }
                onAppendIconClick={() => {
                  ctxValue.toggleCalendar();
                }}
                appendIconColor="text-gray-400"
                isDisabled={isDisabled}
              />
            </div>
          )}
        </Reference>

        {!isDisabled && (
          // @ts-ignore
          <Popper
            placement="bottom-start"
            innerRef={(node) => (popupNode.current = node)}
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 5],
                },
              },
            ]}
          >
            {({ ref, style, placement }) =>
              ctxValue.isVisible ? (
                <div>
                  <Calendar placement={placement} style={style} ref={ref} />
                </div>
              ) : null
            }
          </Popper>
        )}
      </Manager>
    </MonthPickerCtx.Provider>
  );
}

interface CalendarProps {
  style: React.CSSProperties;
  placement: string;
  ref: React.Ref<HTMLDivElement>;
}

// @ts-ignore
const Calendar: React.FC<CalendarProps> = React.forwardRef<
  HTMLDivElement,
  CalendarProps
>((props, ref) => {
  const { view } = useContext(MonthPickerCtx);

  let selectionComponent = null;
  switch (view) {
    case "month":
      selectionComponent = <MonthSelection />;
      break;
    case "year":
      selectionComponent = <YearSelection />;
      break;
  }

  return (
    <div
      className=" focus:outline-none focus:ring-1 focus:ring-primary  bg-white z-40 relative shadow-lg max-w-xs w-64 p-2 rounded-lg  ring-1 ring-black ring-opacity-5 "
      ref={ref}
      data-placement={props.placement}
      // @ts-ignore
      style={props.style}
    >
      {selectionComponent}
    </div>
  );
});

const MonthSelection: React.FC<{}> = (_) => {
  const {
    viewYears,
    selectMonth,
    nextYear,
    prevYear,
    visible,
    isSelectedMonth,
    isWithinRange,
  } = useContext(MonthPickerCtx);

  return (
    <div
      className="h-48"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridTemplateRows: "2rem auto",
        alignItems: "stretch",
      }}
    >
      <div className="flex" style={{ gridColumn: "1/5" }}>
        <CalendarButton chevron="left" onClick={() => prevYear()} />
        <CalendarButton className="flex-grow" onClick={() => viewYears()}>
          {visible.year}
        </CalendarButton>
        <CalendarButton chevron="right" onClick={() => nextYear()} />
      </div>

      {monthNames.map((month, index) => {
        let inRange: boolean = isWithinRange(index);

        return (
          <CalendarButton
            key={month}
            onClick={() => {
              if (inRange) {
                selectMonth(index);
              }
            }}
            className={` focus:outline-none focus:ring-1 focus:ring-primary  hover:bg-gray-200 rounded p-1 ${
              isSelectedMonth(index) ? "bg-gray-300 font-semibold " : ""
            }
            ${inRange ? "" : " text-gray-400 cursor-not-allowed"}`}
          >
            {month.substring(0, 3)}
          </CalendarButton>
        );
      })}
    </div>
  );
};

const YearSelection: React.FC<{}> = (_) => {
  const {
    selectYear,
    prevDecade,
    nextDecade,
    visible: { year },
  } = useContext(MonthPickerCtx);

  let years = [];
  let [minYear, maxYear] = [year - 6, year + 6];

  for (let i = minYear; i < maxYear; i++) {
    years.push(
      <CalendarButton key={i} onClick={() => selectYear(i)}>
        {i}
      </CalendarButton>
    );
  }

  return (
    <div
      className="h-48"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridTemplateRows: "2rem auto",
        alignItems: "stretch",
      }}
    >
      <div className="flex" style={{ gridColumn: "1/5" }}>
        <CalendarButton chevron="left" onClick={() => prevDecade()} />
        <CalendarButton className="flex-grow">{`${minYear} - ${
          maxYear - 1
        }`}</CalendarButton>
        <CalendarButton chevron="right" onClick={() => nextDecade()} />
      </div>

      {years}
    </div>
  );
};

const CalendarButton: React.FC<{
  chevron?: "right" | "left";
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLButtonElement>;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: any;
}> = (props) => {
  let children = null;

  if (props.chevron && props.chevron === "left")
    children = (
      <FontAwesomeIcon icon="chevron-left" className="stroke-current" />
    );
  else if (props.chevron && props.chevron === "right")
    children = (
      <FontAwesomeIcon icon="chevron-right" className="stroke-current" />
    );
  else children = props.children;

  return (
    <button
      tabIndex={0}
      className={`hover:bg-gray-200 rounded p-1  flex justify-center  align-center  focus:outline-none focus:ring-1 focus:ring-primary  items-center ${props.className}`}
      // @ts-ignore
      style={props.style}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
};

export { MonthPicker };
