import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import CharacteristicValue from '../CharacteristicValue';
import config from '../../../../../../config.json';

const {
  horizontalInsets,
  animate,
  sortColorImageCharacteristic,
} = config;

const insets = horizontalInsets || 0;

const scrollOffset = 16;
const animationDuration = animate ? 250 : 0;

const useStyles = makeStyles()(theme => ({
  root: {
    ...(animate ? {
      transition: `max-height ${animationDuration}ms cubic-bezier(0, 1, 0, 1)`,
    } : null),
    maxHeight: 0,
    overflow: 'hidden',
    margin: `0 -${insets}px 0 -${insets}px`,
  },
  open: {
    maxHeight: '100vh !important',
    ...(animate ? {
      transition: `max-height ${animationDuration * 2}ms ease-in-out !important`,
    } : null),
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    overflow: 'auto',
    paddingTop: 8,
    paddingBottom: 16,
  },
  valuesContainer: {
    display: 'flex',
    flex: 1,
  },
  value: {
    whiteSpace: 'nowrap',
    margin: '0 6px',
  },
  terminator: {
    background: theme.palette.secondary.main,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    width: 4,
    marginRight: 4,
    marginLeft: 0,
  },
  terminatorEnd: {
    transform: 'rotate(180deg)',
    marginLeft: 4,
    marginRight: 0,
  },
}));

/**
 * Characteristic component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CharacteristicValues = ({
  values,
  onClick,
  open,
  characteristicId,
  characteristicLabel,
}) => {
  const { classes, cx } = useStyles();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || open === true) return;
    const selected = containerRef.current.querySelector('.selected');
    if (!selected) return;
    setTimeout(() => {
      containerRef.current.scrollTo({ left: selected.offsetLeft - scrollOffset });
    }, animationDuration * 2);
  }, [open, values]);

  /**
   * Get an sort number from value label and sortValues
   * @param {Object} value Product values object
   * @param {Array} sortValuesArray Array of labels in the order they should be sorted
   * @return {number}
  */
  const valueToIndex = (value, sortValuesArray) => {
    const { label } = value || {};

    if (!label) {
      return sortValuesArray.length;
    }

    const valueIndex = sortValuesArray.indexOf(label);

    return valueIndex < 0 ? sortValuesArray.length : valueIndex;
  };

  const sortColorImageCharacteristicArray = sortColorImageCharacteristic
    .split(',')
    .filter(sortChar => !!sortChar)
    .map(sortChar => sortChar.trim());

  const sortedValues = values
    .filter((value) => {
      const { label } = value || {};
      return !!label;
    })
    .sort((valueA, valueB) => (
      // eslint-disable-next-line max-len
      valueToIndex(valueA, sortColorImageCharacteristicArray) - valueToIndex(valueB, sortColorImageCharacteristicArray)
    ));

  return (
    <div
      className={cx(classes.root, 'pdp-variant-accordion__characteristic__values', {
        [classes.open]: open,
      })}
      aria-hidden={!open}
    >
      <div className={classes.container} ref={containerRef}>
        <div className={classes.terminator}>&nbsp;</div>
        <div className={classes.valuesContainer}>
          { sortedValues.map(value => (
            <CharacteristicValue
              key={value.id}
              characteristicId={characteristicId}
              characteristicLabel={characteristicLabel}
              value={value}
              onClick={onClick}
              className={classes.value}
            />
          ))}
        </div>
        <div className={cx(classes.terminator, classes.terminatorEnd)}>&nbsp;</div>
      </div>
    </div>
  );
};

CharacteristicValues.propTypes = {
  characteristicId: PropTypes.string.isRequired,
  characteristicLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  open: PropTypes.bool,
};

CharacteristicValues.defaultProps = {
  open: false,
};

export default CharacteristicValues;
