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
    return null;
  }, []);

  const value = useMemo(() => ({
    allowMultipleOpen,
    characteristicStates: characteristicStates || [],
    setOpenState,
    getSwatchColor,
  }), [characteristicStates, setOpenState]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

ProductCharacteristicsProvider.propTypes = {
  characteristics: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  children: PropTypes.node,
};

ProductCharacteristicsProvider.defaultProps = {
  children: null,
};

export default connect(ProductCharacteristicsProvider);
