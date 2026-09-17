import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import Transition from 'react-transition-group/Transition';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import CharacteristicValue from './components/CharacteristicValue';
import CharacteristicValues from './components/CharacteristicValues';
import { useProductCharacteristics } from '../../hooks';
import config from '../../../../config.json';

const {
  horizontalInsets,
  characteristicBorderColor,
  showBottomBorder,
  showVariantPrices,
  variantSelectionAlwaysOpen,
} = config;

const insets = horizontalInsets || 0;

const useStyles = makeStyles()(theme => ({
  root: {
    paddingLeft: insets,
    paddingRight: insets,
    transition: 'background 250ms ease-in, color 250ms ease-in',
    cursor: 'pointer',
  },
  disabled: {
    color: theme.palette.text.disabled,
    cursor: 'default !important',
  },
  container: {
    borderTop: '1px solid',
    borderTopColor: characteristicBorderColor || theme.components.border.medium,
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
  },
  containerLast: {
    ...(showBottomBorder ? {
      borderBottom: '1px solid',
      borderBottomColor: characteristicBorderColor || theme.components.border.medium,
    } : null),
  },
  characteristic: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: insets ? 0 : 16,
    paddingRight: insets ? 0 : 16,
  },
  label: {
    display: 'flex',
    fontWeight: 'bold',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    textAlign: 'left',
  },
  value: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingLeft: 4,
    textAlign: 'right',
  },
}));

/**
 * Characteristic component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const Characteristic = ({
  charRef,
  disabled,
  highlight,
  id,
  label,
  select,
  values,
  resetHighlight,
}) => {
  const { classes, cx, theme } = useStyles();
  const {
    characteristicStates,
    setOpenState,
    allowMultipleOpen,
    productVariants,
  } = useProductCharacteristics();

  const transition = {
    entering: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    entered: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  };

  // Determine the states for the current characteristic
  const { isOpen, isLast } = useMemo(
    () => characteristicStates.find(({ id: entryId }) => entryId === id) || {},
    [characteristicStates, id]
  );

  const selectedValue = useMemo(
    () => values.find(({ selected: selectedItem }) => !!selectedItem),
    [values]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    setOpenState(id, variantSelectionAlwaysOpen ? true : !isOpen);
  }, [disabled, id, isOpen, setOpenState]);

  const handleValueClick = useCallback((valueId) => {
    if (disabled) return;
    if (!allowMultipleOpen) {
      setOpenState(id, false);
    }
    select({
      id,
      value: valueId,
    });
  }, [allowMultipleOpen, disabled, id, select, setOpenState]);

  /**
   * The following code extends the characteristic values array with price data from the
   * products list.
   *
   * If no price data is available, the original values array will be passed to the
   * CharacteristicValues component which will not display any price properties.
   */
  const enrichedValues = useMemo(() => {
    if (!productVariants || !showVariantPrices) {
      return values;
    }

    const enriched = values.map((value) => {
      const match = find(productVariants, { characteristics: { [id]: value.id } });

      return {
        ...value,
        ...(match ? { price: match.price } : null),
      };
    });

    return enriched;
  }, [id, productVariants, values]);

  return (
    <Transition in={highlight} timeout={500} onEntered={resetHighlight}>
      { state => (
        <div
          className={cx(classes.root, 'pdp-variant-accordion__characteristic', { disabled })}
          ref={charRef}
          style={transition[state]}
        >
          <div
            className={cx(
              classes.container,
              'pdp-variant-accordion__characteristic__header',
              {
                [classes.containerLast]: isLast,
                [classes.disabled]: disabled,
              }
            )}
          >
            <div
              className={classes.characteristic}
              onClick={handleClick}
              onKeyDown={() => {}}
              role="button"
              aria-expanded={isOpen}
              aria-disabled={disabled}
              tabIndex="-1"
            >
              <div className={classes.label}>
                {label}
              </div>
              <div className={classes.value}>
                { selectedValue ? (
                  <CharacteristicValue
                    characteristicId={id}
                    characteristicLabel={label}
                    value={selectedValue}
                  />
                ) : (
                  <I18n.Text string="product.pick_an_attribute" params={[label]} />
                )}
              </div>
            </div>
            <CharacteristicValues
              characteristicId={id}
              characteristicLabel={label}
              values={enrichedValues}
              open={isOpen}
              onClick={handleValueClick}
            />
          </div>
        </div>
      )}
    </Transition>
  );
};

Characteristic.propTypes = {
  charRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape(),
  ]).isRequired,
  disabled: PropTypes.bool.isRequired,
  highlight: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  resetHighlight: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default Characteristic;
