import React, {
  Fragment, memo, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useProductCharacteristics } from '../../../../hooks';
import config from '../../../../../../config';

const { colors } = themeConfig;

const {
  characteristicValueBorderColor,
  characteristicValueBorderColorSelected,
  showSwatchAsCircle,
  showLabelBelowSwatch,
  colorCharacteristic,
  imageOverlayLabelColor,
} = config;

const borderColor = characteristicValueBorderColor || '#DCDCDC';
const borderColorSelected = characteristicValueBorderColorSelected || colors.accent;

const styles = {
  root: css({
    border: `1px solid ${borderColor}`,
    borderRadius: 4,
    padding: 8,
    display: 'flex',
    minWidth: 70,
    justifyContent: 'center',
  }).toString(),
  selected: css({
    borderColor: `${borderColorSelected} !important`,
    borderWidth: '2px !important',
  }).toString(),
  disabled: css({
    color: colors.shade4,
    cursor: 'default',
    ' > span': {
      opacity: 0.4,
    },
  }).toString(),
  swatchContainer: css({
    display: 'block',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: '80px',
  }).toString(),
  swatch: css({
    width: '100%',
    borderRadius: 3,
  }).toString(),
  swatchAsCircle: css({
    width: '100%',
    height: '100%',
    borderRadius: 50,
  }).toString(),
  buttonAsCircle: css({
    width: '70px',
    height: '70px',
    borderRadius: '50px',
    margin: 'auto',
  }).toString(),
  imageOverlayLabel: css({
    fontSize: '12px',
    lineHeight: '50px',
    color: imageOverlayLabelColor || '#fff',
  }).toString(),
  labelBelowSwatch: css({
    marginTop: '4px',
  }).toString(),
};

/**
 * CharacteristicValue
 * @param {Object} props Component props
 * @param {Object} ref Forwarded ref
 * @returns {JSX}
 */
const CharacteristicValue = ({
  value, className, onClick, characteristicId, characteristicLabel,
}) => {
  const {
    id, label, selected, selectable,
  } = value;

  const { getSwatchColor, getSwatchImage } = useProductCharacteristics();

  const clickable = useMemo(() => typeof onClick === 'function', [onClick]);

  const isColorCharacteristicLabel = useMemo(
    () => Array.isArray(colorCharacteristic) &&
    colorCharacteristic.includes(characteristicLabel), [characteristicLabel]
  );

  // Determine if the value needs to be displayed as a swatch
  const swatchColor = useMemo(() => getSwatchColor({
    id: characteristicId,
    label: characteristicLabel,
  }, value), [value, characteristicId, characteristicLabel, getSwatchColor]);

  // Determine if the value needs to be displayed as a swatch image
  const swatchImage = useMemo(() => getSwatchImage({
    id: characteristicId,
    label: characteristicLabel,
  }, value), [value, characteristicId, characteristicLabel, getSwatchImage]);

  const classes = useMemo(() => classNames(
    styles.root,
    className,
    'pdp-variant-accordion__characteristic__value',
    showSwatchAsCircle && isColorCharacteristicLabel ? styles.buttonAsCircle : null,
    {
      [styles.selected]: clickable && selected,
      [styles.disabled]: !selectable,
      selected: clickable && selected,
      disabled: !selectable,
    }
  ), [className, selectable, selected, clickable, isColorCharacteristicLabel]);

  const handleClick = useCallback(() => {
    if (selectable && onClick) {
      onClick(id);
    }
  }, [selectable, id, onClick]);

  const Component = useCallback((props) => {
    if (onClick) {
      return (<button type="button" onClick={handleClick} disabled={!selectable} {...props} />);
    }

    return (<div {...props} />);
  }, [selectable, handleClick, onClick]);

  return (
    <div className={styles.swatchContainer}>
      <Component className={classes}>
        { swatchColor || swatchImage ? (
          <>
            <span
              className={
                showSwatchAsCircle &&
                isColorCharacteristicLabel ? styles.swatchAsCircle : styles.swatch
              }
              style={{
                background: swatchColor,
                backgroundImage: `url(${swatchImage ? swatchImage.imageUrl : ''})`,
              }}
            >
              { swatchImage && swatchImage.imageOverlayLabel ? (
                <span className={styles.imageOverlayLabel}>{swatchImage ? swatchImage.imageOverlayLabel : ''}</span>
              ) : null}
            </span>
          </>
        ) : (
          <Fragment>
            {label}
          </Fragment>
        )}
      </Component>
      { showLabelBelowSwatch && isColorCharacteristicLabel ? (
        <p className={styles.labelBelowSwatch}>
          {label}
        </p>
      ) : null}
    </div>
  );
};

CharacteristicValue.propTypes = {
  characteristicId: PropTypes.string.isRequired,
  characteristicLabel: PropTypes.string.isRequired,
  value: PropTypes.shape().isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

CharacteristicValue.defaultProps = {
  className: null,
  onClick: null,
};

export default memo(CharacteristicValue);
