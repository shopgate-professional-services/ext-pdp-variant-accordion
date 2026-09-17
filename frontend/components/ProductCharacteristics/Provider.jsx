import React, {
  createContext, useMemo, useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  getProductVariants,
  hasProductVariants,
} from '@shopgate/engage/product';
import { getColorCharacteristic, getColorImageCharacteristic } from '../../selectors';
import config from '../../config.json';

export const Context = createContext();

const allowMultipleOpen = false;
const { variantSelectionAlwaysOpen } = config;

/**
 * ProductCharacteristicsProvider
 * @param {Object} props Component props
 * @returns {JSX}
 */
const ProductCharacteristicsProvider = ({
  productId,
  variantId,
  children,
}) => {
  const selectorProps = useMemo(() => ({
    productId,
    variantId,
  }), [productId, variantId]);

  const variants = useSelector(state => getProductVariants(state, selectorProps));
  const hasVariants = useSelector(state => hasProductVariants(state, selectorProps));
  const colorCharacteristic = useSelector(state => getColorCharacteristic(state, selectorProps));
  const colorImageCharacteristic = useSelector(
    state => getColorImageCharacteristic(state, selectorProps)
  );

  const isFetching = !!hasVariants && !variants;

  const characteristics = useMemo(
    () => (variants ? variants.characteristics : []),
    [variants]
  );

  // Prices can only be shown when the base product has a single characteristic
  const products = useMemo(() => {
    const hasSingleCharacteristic = variants
      && Array.isArray(variants.characteristics)
      && variants.characteristics.length === 1;

    return hasSingleCharacteristic ? variants.products : null;
  }, [variants]);

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
      isOpen: variantSelectionAlwaysOpen,
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

  const productVariants = products || null;

  /**
   * Determines a swatch image that's displayed instead of a characteristic value label or color
   * @returns {Object|null}
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
    isFetching,
    allowMultipleOpen,
    productVariants,
    characteristicStates: characteristicStates || [],
    setOpenState,
    getSwatchColor,
    getSwatchImage,
  }), [
    isFetching,
    productVariants,
    characteristicStates,
    getSwatchColor,
    getSwatchImage,
    setOpenState,
  ]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

ProductCharacteristicsProvider.propTypes = {
  productId: PropTypes.string.isRequired,
  children: PropTypes.node,
  variantId: PropTypes.string,
};

ProductCharacteristicsProvider.defaultProps = {
  children: null,
  variantId: null,
};

export default ProductCharacteristicsProvider;
