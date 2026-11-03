import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Price, PriceStriked, HtmlSanitizer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useProductCharacteristics } from '../../../../hooks';
import { isColorCharacteristicLabel as isColorCharacteristic } from '../../../../../../helpers';
import config from '../../../../../../config.json';

const {
  characteristicValueBorderColor,
  characteristicValueBorderColorSelected,
  showSwatchAsCircle,
  showLabelBelowSwatch,
  imageOverlayLabelColor,
  imageSwatchSize,
  imageSwatchBackgroundSize,
} = config;

const useStyles = makeStyles()(theme => ({
  root: {
    border: `1px solid ${characteristicValueBorderColor || theme.components.border.medium}`,
    borderRadius: theme.shape.borderRadius,
    padding: 8,
    display: 'flex',
    minWidth: 70,
    justifyContent: 'center',
  },
  selected: {
    borderColor: `${characteristicValueBorderColorSelected || theme.palette.secondary.main}`,
    borderWidth: 2,
  },
  disabled: {
    color: theme.palette.text.disabled,
    cursor: 'default',
    ' > span': {
      opacity: 0.4,
    },
  },
  swatchContainer: {
    display: 'block',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: '80px',
  },
  swatch: {
    width: '100%',
    borderRadius: 3,
  },
  container: {
    display: 'block',
    textAlign: 'center',
  },
  priceContainer: {
    display: 'block',
    position: 'relative',
  },
  priceStriked: {
    fontSize: '1.25rem',
  },
  price: {
    display: 'inline-block',
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  asterisk: {
    fontSize: '1.5rem',
    fontWeight: 300,
  },
  swatchAsCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  buttonAsCircle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    margin: 'auto',
  },
  imageOverlayLabel: {
    fontSize: '12px',
    lineHeight: `${imageSwatchSize}px`,
    color: imageOverlayLabelColor || '#fff',
  },
  labelBelowSwatch: {
    marginTop: 4,
    fontSize: '0.6rem',
  },
}));

/**
 * CharacteristicValue
 * @param {Object} props Component props
 * @param {Object} ref Forwarded ref
 * @returns {JSX}
 */
const CharacteristicValue = ({
  value, className, onClick, characteristicId, characteristicLabel,
}) => {
  const { classes, cx } = useStyles();
  const {
    id, label, selected, selectable, price,
  } = value;

  // Extract required injected price data from the characteristic value
  const {
    basePrice,
    unitPrice,
    currency,
    priceStriked,
  } = useMemo(() => {
    if (!price) {
      return {};
    }

    return {
      basePrice: price.info,
      unitPrice: price.unitPrice,
      currency: price.currency,
      priceStriked: price.unitPriceStriked,
    };
  }, [price]);

  const { getSwatchColor, getSwatchImage } = useProductCharacteristics();

  const clickable = useMemo(() => typeof onClick === 'function', [onClick]);

  const isColorCharacteristicLabel = useMemo(
    () => isColorCharacteristic(characteristicLabel),
    [characteristicLabel]
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

  // Determine if the value needs to be displayed as a circle
  const asCircle = useMemo(
    () => showSwatchAsCircle && isColorCharacteristicLabel,
    [isColorCharacteristicLabel]
  );

  const valueClassName = useMemo(() => cx(
    classes.root,
    className,
    'pdp-variant-accordion__characteristic__value',
    {
      [classes.buttonAsCircle]: asCircle,
      [classes.selected]: clickable && selected,
      [classes.disabled]: !selectable,
      selected: clickable && selected,
      disabled: !selectable,
    }
  ), [className, selectable, selected, clickable, asCircle, classes, cx]);

  const handleClick = useCallback(() => {
    if (selectable && onClick) {
      onClick(id);
    }
  }, [selectable, id, onClick]);

  const swatchStyle = useMemo(() => ({
    background: swatchColor,
    ...(swatchImage && { backgroundImage: `url(${swatchImage.imageUrl})` }),
    backgroundSize: imageSwatchBackgroundSize,
    width: `${imageSwatchSize}px`,
    height: `${imageSwatchSize}px`,
  }), [swatchColor, swatchImage]);

  const content = swatchColor || swatchImage ? (
    <span
      className={asCircle ? classes.swatchAsCircle : classes.swatch}
      style={swatchStyle}
    >
      { swatchImage && swatchImage.imageOverlayLabel ? (
        <span className={classes.imageOverlayLabel}>{swatchImage.imageOverlayLabel}</span>
      ) : null}
    </span>
  ) : (
    <div className={classes.container}>
      <span>
        {label}
      </span>
      <div className={classes.priceContainer}>
        {priceStriked ? (
          <PriceStriked
            value={priceStriked}
            currency={currency}
            className={classes.priceStriked}
          />
        ) : null}
        {currency ? (
          <>
            <Price
              unitPrice={unitPrice}
              currency={currency}
              className={classes.price}
            />
            <span className={classes.asterisk}>
              *
            </span>
          </>
        ) : null}
        <span>
          { basePrice ? (
            <HtmlSanitizer>
              {basePrice}
            </HtmlSanitizer>
          ) : null}
        </span>
      </div>
    </div>
  );

  return (
    <div className={classes.swatchContainer}>
      { onClick ? (
        <button
          type="button"
          className={valueClassName}
          aria-disabled={!selectable}
          aria-pressed={selected}
          onClick={handleClick}
          disabled={!selectable}
        >
          {content}
        </button>
      ) : (
        <div className={valueClassName}>
          {content}
        </div>
      )}
      { showLabelBelowSwatch && isColorCharacteristicLabel ? (
        <p className={classes.labelBelowSwatch}>
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
