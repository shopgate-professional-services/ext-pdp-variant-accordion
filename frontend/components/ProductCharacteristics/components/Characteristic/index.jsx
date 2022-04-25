import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import { I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CharacteristicValue from './components/CharacteristicValue';
import CharacteristicValues from './components/CharacteristicValues';
import { useProductCharacteristics } from '../../hooks';
import config from '../../../../config';

const { colors } = themeConfig;

const {
  horizontalInsets,
  characteristicBorderColor,
  showTrailingBorder,
} = config;

const insets = horizontalInsets || 0;
const borderColor = characteristicBorderColor || '#C6C6C6';

const styles = {
  root: css({
    paddingLeft: insets,
    paddingRight: insets,
    transition: 'background 250ms ease-in, color 250ms ease-in',
    cursor: 'pointer',
  }).toString(),
  disabled: css({
    color: colors.shade4,
    cursor: 'default !important',
  }),
  container: css({
    borderTop: '1px solid',
    borderTopColor: borderColor,
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
  }).toString(),
  containerLast: css({
    ...(showTrailingBorder ? {
      borderBottom: '1px solid',
      borderBottomColor: borderColor,
    } : null),
  }).toString(),
  characteristic: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: insets ? 0 : 16,
    paddingRight: insets ? 0 : 16,
  }),
  label: css({
    display: 'flex',
    fontWeight: 'bold',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    textAlign: 'left',
  }),
  value: css({
    display: 'flex',
    justifyContent: 'flex-end',
    paddingLeft: 4,
    textAlign: 'right',
  }),
};

const transition = {
  entering: {
    background: colors.primary,
    color: colors.primaryContrast,
  },
  entered: {
    background: colors.primary,
    color: colors.primaryContrast,
  },
};

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
  const {
    characteristicStates,
    setOpenState,
    allowMultipleOpen,
  } = useProductCharacteristics();

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
    setOpenState(id, !isOpen);
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

  return (
    <Transition in={highlight} timeout={500} onEntered={resetHighlight}>
      { state => (
        <div
          className={
          classNames(styles.root, 'pdp-variant-accordion__characteristic', {
            disabled,
          })}
          ref={charRef}
          style={transition[state]}
        >
          <div
            className={classNames(
              styles.container,
              'pdp-variant-accordion__characteristic__header', {
                [styles.containerLast]: isLast,
                [styles.disabled]: disabled,
              }
            )}
          >
            <div
              className={styles.characteristic}
              onClick={handleClick}
              onKeyDown={() => {}}
              role="button"
              tabIndex="-1"
            >
              <div className={styles.label}>
                {label}
              </div>
              <div className={styles.value}>
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
              values={values}
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
