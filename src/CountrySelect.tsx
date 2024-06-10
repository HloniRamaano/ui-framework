import * as countryUtils from "./utils/countryUtils";
import * as generalUtils from "./utils/generalUtils";
// @ts-ignore
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICountry } from "./interfaces/country.interface";
import { Select } from "./Select";
import * as FlagIcons from "country-flag-icons/react/3x2";
import { ICountrySelect } from "./interfaces/countrySelect.interface";

function CountrySelect(props: ICountrySelect) {
  let {
    label,
    allowedCountryCodes,
    allowOtherCountries,
    isMultiSelection,
    value,
    allowDeselect,
    showAllSelectedCountries,
    containerClassName,
    selectedCountriesContainerClassName,
    isReadOnly,
    shouldOverlapLabel,
  } = props;

  const [countrySelectOptions, setCountrySelectOptions] = useState<
    { label: any; value: any }[]
  >(buildCountrySelectOptions());
  const [selection, setSelection] = useState<any>(isMultiSelection ? [] : null);
  const [customSelectionValue, setCustomSelectionValue] = useState<any>();

  useEffect(() => {
    onSelectionChanged(value);
  }, []);

  useEffect(() => {
    if (!isMultiSelection && value !== selection) {
      onSelectionChanged(value);
    }
  }, [value]);

  useEffect(() => {
    let countries = buildCountrySelectOptions(
      allowedCountryCodes?.map((code: string) => {
        return code.toUpperCase();
      })
    );

    setCountrySelectOptions(countries);
  }, [allowedCountryCodes]);

  function onSelectionChanged(selectedCountryCodes: any) {
    setSelection(generalUtils.clone(selectedCountryCodes));
    if (props.onChange) {
      props.onChange(selectedCountryCodes);
    }

    if (isMultiSelection) {
      if (selectedCountryCodes.length === 1) {
        setCustomSelectionValue(
          countryUtils.getCountryByCode(
            selectedCountryCodes[0],
            allowOtherCountries
          ) ?? <FontAwesomeIcon icon="flag" />
        );
      } else {
        setCustomSelectionValue(null);
      }
    } else {
      if (selectedCountryCodes) {
        let country = countryUtils.getCountryByCode(
          selectedCountryCodes,
          allowOtherCountries
        );
        // @ts-ignore
        let Flag: any = FlagIcons[country.code.toUpperCase()];
        setCustomSelectionValue(
          (
            <div className="pr-4">
              {Flag ? (
                <div className="h-6 flex items-center">
                  <Flag className="h-4" />
                </div>
              ) : (
                country?.flag
              )}
            </div>
          ) ?? <FontAwesomeIcon icon="flag" />
        );
      } else {
        setCustomSelectionValue(null);
      }
    }
  }

  function buildCountrySelectOptions(allowedCountryCodes?: string[]) {
    const allCountries: ICountry[] = allowedCountryCodes
      ? countryUtils.getAllCountriesInListOfCodes(
          allowedCountryCodes,
          allowOtherCountries
        )
      : countryUtils.getAllCountries(allowOtherCountries);

    let displayCountries = [...allCountries];
    let countries = displayCountries.map((country: ICountry) => {
      // @ts-ignore
      let Flag: any = FlagIcons[country.code.toUpperCase()];
      let labelCustomHTML = (
        <div className=" w-full pr-4">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4 items-center">
              <div>{Flag ? <Flag className="h-4" /> : country.flag}</div>
              <div>{country.name}</div>
            </div>
            <div>{country.dialCode}</div>
          </div>
        </div>
      );

      return { label: country.name, labelCustomHTML, value: country.code };
    });

    return countries;
  }

  function renderSelectedCountries() {
    return (
      <div
        className={
          selectedCountriesContainerClassName ?? "max-h-24 overflow-auto"
        }
      >
        <div className="flex flex-wrap">
          {selection.map((code: string, index: number) => {
            let country: ICountry | null = countryUtils.getCountryByCode(
              code,
              allowOtherCountries
            );
            if (country) {
              // @ts-ignore
              let Flag: any = FlagIcons[country.code.toUpperCase()];
              return (
                <div className="text-sm pt-4" key={index}>
                  <div className="flex flex-row items-center space-x-2 bg-gray-200 rounded-full mr-4 px-3 py-1 text-sm">
                    <div>{Flag ? <Flag className="h-4" /> : country.flag}</div>
                    <div>{country.name}</div>
                    <FontAwesomeIcon
                      icon="times"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => {
                        let codes = [...selection];
                        codes.splice(index, 1);
                        onSelectionChanged(codes);
                      }}
                    />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  function render() {
    return (
      <div>
        <div className={containerClassName ?? ""}>
          <Select
            shouldOverlapLabel={shouldOverlapLabel}
            isDisabled={isReadOnly}
            noMargin
            label={label}
            allowDeselect={allowDeselect}
            customSelectionValue={customSelectionValue}
            popoverWidth="w-80"
            options={countrySelectOptions}
            value={selection}
            onChange={(value: any) => {
              onSelectionChanged(value);
            }}
            isMultiSelection={isMultiSelection}
          />
        </div>
        {showAllSelectedCountries &&
          isMultiSelection &&
          renderSelectedCountries()}
      </div>
    );
  }
  return render();
}

export { CountrySelect };
