import { createSelector } from 'reselect';
import { getProductVariants } from '@shopgate/engage/product';
import { isDev } from '@shopgate/engage/core';
import { colorCharacteristic, propertyWithColor } from '../config';

export const getColorCharacteristic = createSelector(
  getProductVariants,
  (variants) => {
    if (!variants) {
      return null;
    }

    const characteristic = variants.characteristics.find(char => (
      colorCharacteristic.includes(char.label)
    ));

    if (!characteristic) {
      return null;
    }

    // Every swatch value should read propertyWithColor
    const updateValues = characteristic.values.map((value) => {
      const { additionalProperties } = variants.products.find(p => (
        p.characteristics[characteristic.id] === value.id
      )) || {};

      let property;

      if (additionalProperties) {
        property = additionalProperties.find(p => p.label === propertyWithColor);

        if (isDev) {
          const needles = ['Black', 'Blue'];
          const colors = ['#0056CD', '#D3148E', '#FAED10'];

          if (needles.includes(property.value)) {
            property.value = colors[needles.findIndex(entry => entry === property.value)];
          }
        }

        if (!/(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^)]*\)/i.test(property.value)) {
          property = null;
        }
      }

      return {
        ...value,
        color: property ? property.value : null,
      };
    }).filter(Boolean);

    return {
      ...characteristic,
      values: updateValues,
    };
  }
);
