import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CharacteristicValue from '../CharacteristicValue';
import config from '../../../../../../config';
const { colors } = themeConfig;

const {
  horizontalInsets,
  animate,
} = config;

const insets = horizontalInsets || 0;

const scrollOffset = 16;
const animationDuration = animate ? 250 : 0;

const styles = {
  root: css({
    ...(animate ? {
      transition: `max-height ${animationDuration}ms cubic-bezier(0, 1, 0, 1)`,
    } : null),
    maxHeight: 0,
    overflow: 'hidden',
    margin: `0 -${insets}px 0 -${insets}px`,
  }).toString(),
  open: css({
    maxHeight: '100vh !important',
    ...(animate ? {
      transition: `max-height ${animationDuration * 2}ms ease-in-out !important`,
    } : null),
  }).toString(),
  container: css({
    display: 'flex',
    justifyContent: 'space-between',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch',
    overflow: 'auto',
    paddingTop: 8,
    paddingBottom: 16,
  }),
  valuesContainer: css({
    display: 'flex',
    flex: 1,
  }),
  value: css({
    whiteSpace: 'nowrap',
    margin: '0 6px',
  }).toString(),
  terminator: css({
    background: colors.primary,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    width: 4,
    marginRight: 4,
    marginLeft: 0,
  }).toString(),
  terminatorEnd: css({
    transform: 'rotate(180deg)',
    marginLeft: 4,
    marginRight: 0,
  }).toString(),
};

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
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || open === true) return;
    const selected = containerRef.current.querySelector('.selected');
    if (!selected) return;
    setTimeout(() => {
      containerRef.current.scrollTo({ left: selected.offsetLeft - scrollOffset });
    }, animationDuration * 2);
  }, [open, values]);

  return (
    <div
      className={classNames(styles.root, 'pdp-variant-accordion__characteristic__values', {
        [styles.open]: open,
      })}
    >
      <div className={styles.container} ref={containerRef}>
        <div className={classNames(styles.terminator)}>&nbsp;</div>
        <div className={styles.valuesContainer}>
          { values.map((value) => (
            <CharacteristicValue
              key={value.id}
              characteristicId={characteristicId}
              characteristicLabel={characteristicLabel}
              value={value}
              onClick={onClick}
              className={styles.value}
            />
          ))}
        </div>
        <div className={classNames(styles.terminator, styles.terminatorEnd)}>&nbsp;</div>
      </div>
    </div>
  );
};

CharacteristicValues.propTypes = {
  onClick: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  characteristicId: PropTypes.string.isRequired,
  characteristicLabel: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

CharacteristicValues.defaultProps = {
  open: false,
};

export default CharacteristicValues;

