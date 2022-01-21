import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import config from '../../../../../../config';

const { colors } = themeConfig;

const {
  characteristicValueBorderColor,
  characteristicValueBorderColorSelected,
} = config;

const borderColor =  characteristicValueBorderColor ||'#DCDCDC';
const borderColorSelected = characteristicValueBorderColorSelected || colors.primary;

const styles = {
  root: css({
    border: `1px solid ${borderColor}`,
    borderRadius: 4,
    padding: '4px 8px',
    display: 'flex',
  }).toString(),
  selected: css({
    borderColor: `${borderColorSelected} !important`,
    borderWidth: '2px !important',
  }).toString(),
  disabled: css({
    color: colors.shade4,
    cursor: 'default',
  }).toString(),
};

/**
 * CharacteristicValue
 * @param {Object} props Component props
 * @param {Object} ref Forwarded ref
 * @returns {JSX}
 */
const CharacteristicValue = ({
  label, selected, disabled, className, onClick, id,
}) => {
  const classes = useMemo(() => classNames(
    styles.root,
    className,
    'pdp-variant-accordion__characteristic__value',
    {
      [styles.selected]: selected,
      [styles.disabled]: disabled,
      selected,
      disabled,
    }
  ), [className, disabled, selected]);

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick(id);
    }
  }, [disabled, id, onClick]);

  const Component = useCallback((props) => {
    if (onClick) {
      return (<button type="button" onClick={handleClick} disabled={disabled} {...props} />);
    }

    return (<div {...props} />);
  }, [disabled, handleClick, onClick]);

  return (
    <Component className={classes}>
      {label}
    </Component>
  );
};

CharacteristicValue.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

CharacteristicValue.defaultProps = {
  id: null,
  selected: false,
  disabled: false,
  className: null,
  onClick: null,
};

export default CharacteristicValue;
