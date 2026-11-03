import config from '../config.json';

const { colorCharacteristic } = config;

/**
 * Checks if a characteristic label is configured to be displayed as a color or image swatch.
 * @param {string} label The label of the characteristic.
 * @returns {boolean}
 */
export const isColorCharacteristicLabel = label => (
  Array.isArray(colorCharacteristic) && colorCharacteristic.includes(label)
);
