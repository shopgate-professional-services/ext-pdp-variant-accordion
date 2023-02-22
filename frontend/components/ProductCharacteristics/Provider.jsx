import React, {
  createContext, useMemo, useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

export const Context = createContext();

const allowMultipleOpen = false;

/**
 * ProductCharacteristicsProvider
 * @param {Object} props Component props
 * @returns {JSX}
 */
const ProductCharacteristicsProvider = ({
  characteristics,
  products,
  colorCharacteristic,
  colorImageCharacteristic,
  children,
}) => {
  const [characteristicStates, setCharacteristicStates] = useState(null);
  // Initialize the characteristic states
  useEffect(() => {
    if (
      !Array.isArray(characteristics) ||
      !characteristics.length ||
      characteristicStates !== null
    ) {
      return;
    }

    const initial = characteristics.map(({ id }, index) => ({
      id,
      isOpen: false,
      isLast: index === characteristics.length - 1,
    }));

    setCharacteristicStates(initial);
  }, [characteristicStates, characteristics]);

  // Update the open state of a characteristic
  const setOpenState = useCallback((characteristicId, isOpen) => {
    const update = characteristicStates.map((entry) => {
      const defaultOpen = allowMultipleOpen ? entry.isOpen : false;

      return {
        ...entry,
        isOpen: entry.id === characteristicId ? isOpen : defaultOpen,
      };
    });

    setCharacteristicStates(update);
  }, [characteristicStates]);

  /**
   * Determines a swatch color that's displayed instead of a characteristic value label
   * @returns {string|null}
   */
  const getSwatchColor = useCallback((characteristic, value) => {
    if (!colorCharacteristic || characteristic.id !== colorCharacteristic.id) {
      return null;
    }
    const { color } = colorCharacteristic.values.find(({ id }) => id === value.id) || {};

    if (!color) {
      return null;
    }

    return color;
  }, [colorCharacteristic]);

  /**
   * Products
   */
  const productVariants = products || null;

  /* Determines a swatch image that's displayed instead of a characteristic value label or color
   * @returns {string|null}
   */
  const getSwatchImage = useCallback((characteristic, value) => {
    if (!colorImageCharacteristic || characteristic.id !== colorImageCharacteristic.id) {
      return null;
    }
    const {
      imageUrl,
      imageOverlayLabel,
    } = colorImageCharacteristic.values.find(({ id }) => id === value.id) || {};

    if (!imageUrl) {
      return null;
    }
    return {
      imageUrl,
      imageOverlayLabel,
    };
  }, [colorImageCharacteristic]);

  const value = useMemo(() => ({
    allowMultipleOpen,
    productVariants,
    characteristicStates: characteristicStates || [],
    setOpenState,
    getSwatchColor,
    getSwatchImage,
  }), [productVariants, characteristicStates, getSwatchColor, getSwatchImage, setOpenState]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

ProductCharacteristicsProvider.propTypes = {
  characteristics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.node,
  colorCharacteristic: PropTypes.shape(),
  colorImageCharacteristic: PropTypes.shape(),
  products: PropTypes.arrayOf(PropTypes.shape()),
};

ProductCharacteristicsProvider.defaultProps = {
  colorCharacteristic: null,
  colorImageCharacteristic: null,
  children: null,
  products: null,
};

export default connect(ProductCharacteristicsProvider);
