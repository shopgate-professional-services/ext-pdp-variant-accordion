import { createSelector } from 'reselect';
import { getProductVariants } from '@shopgate/engage/product';
import { isDev } from '@shopgate/engage/core';
import {
  colorCharacteristic,
  propertyWithColor,
  useImageAsSwatch,
  characteristicValueImageMapping,
} from '../config';
import { IMAGE_OVERLAY_LABEL, IMAGE_URL, SWATCH_IMAGE_PREFIX } from '../constants';

export const getColorCharacteristic = createSelector(
  getProductVariants,
  (variants) => {
    if (!variants || !Array.isArray(colorCharacteristic) || !propertyWithColor) {
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
          const needles = [];
          const colors = [];

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

export const getColorImageCharacteristic = createSelector(
  getProductVariants,
  (variants) => {
    if (!variants || !Array.isArray(colorCharacteristic) || !useImageAsSwatch) {
      return null;
    }

    const characteristic = variants.characteristics.find(char => (
      colorCharacteristic.includes(char.label)
    ));

    if (!characteristic) {
      return null;
    }

    const updateValues = characteristic.values.map((value) => {
      const { additionalProperties } = variants.products.find(p => (
        p.characteristics[characteristic.id] === value.id
      )) || {};
      let property;
      let imageUrl;
      let imageOverlayLabel = null;

      if (characteristicValueImageMapping[value?.label]) {
        const {
          imageOverlayLabel: overlayLabel,
          imageUrl: url,
        } = characteristicValueImageMapping[value.label];
        imageOverlayLabel = overlayLabel;
        imageUrl = url;
      } else if (additionalProperties) {
        property = additionalProperties.find(p => p.label.toUpperCase() === `${SWATCH_IMAGE_PREFIX}${value.label}`.toUpperCase());

        if (!property) {
          imageUrl = null;
          imageOverlayLabel = null;
        } else {
          const values = property.value.split(',').map(vp => vp.trim());
          values.forEach((v) => {
            const valueParts = v.split('~');
            const propLabel = valueParts[0];
            const propValue = valueParts[1];
            if (propLabel === IMAGE_URL) {
              imageUrl = propValue;
            }
            if (propLabel === IMAGE_OVERLAY_LABEL) {
              imageOverlayLabel = propValue;
            }
          });
        }
      }

      return {
        ...value,
        imageUrl,
        imageOverlayLabel,
      };
    }).filter(Boolean);

    return {
      ...characteristic,
      values: updateValues,
    };
  }
);
