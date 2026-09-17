import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Price, PriceStriked, HtmlSanitizer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useProductCharacteristics } from '../../../../hooks';
import config from '../../../../../../config.json';

const {
  characteristicValueBorderColor,
  characteristicValueBorderColorSelected,
  showSwatchAsCircle,
  showLabelBelowSwatch,
  colorCharacteristic,
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
    borderColor: `${characteristicValueBorderColorSelected || theme.palette.secondary.main} !important`,
    borderWidth: '2px !important',
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
  asterix: {
    fontSize: '1.5rem',
    fontWeight: 300,
  },
  swatchAsCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  buttonAsCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50px',
    margin: 'auto',
  },
  imageOverlayLabel: {
    fontSize: '12px',
    lineHeight: `${imageSwatchSize}px`,
    color: imageOverlayLabelColor || '#fff',
  },
  labelBelowSwatch: {
    marginTop: '4px',
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

  const valueClassName = useMemo(() => cx(
    classes.root,
    className,
    'pdp-variant-accordion__characteristic__value',
    showSwatchAsCircle && isColorCharacteristicLabel ? classes.buttonAsCircle : null,
    {
      [classes.selected]: clickable && selected,
      [classes.disabled]: !selectable,
      selected: clickable && selected,
      disabled: !selectable,
    }
  ), [className, selectable, selected, clickable, isColorCharacteristicLabel, classes, cx]);

  const handleClick = useCallback(() => {
    if (selectable && onClick) {
      onClick(id);
    }
  }, [selectable, id, onClick]);

  const Component = useCallback((props) => {
    if (onClick) {
      return (<button
        type="button"
        aria-disabled={!selectable}
        aria-pressed={selected}
        onClick={handleClick}
        disabled={!selectable}
        {...props}
      />);
    }

    return (<div {...props} />);
  }, [onClick, selectable, selected, handleClick]);

  return (
    <div className={classes.swatchContainer}>
      <Component className={valueClassName}>
        { swatchColor || swatchImage ? (
          <span
            className={
              showSwatchAsCircle &&
              isColorCharacteristicLabel ? classes.swatchAsCircle : classes.swatch
            }
            style={{
              background: swatchColor,
              backgroundImage: `url(${swatchImage ? swatchImage.imageUrl : ''})`,
              backgroundSize: imageSwatchBackgroundSize,
              width: `${imageSwatchSize}px`,
              height: `${imageSwatchSize}px`,
            }}
          >
            { swatchImage && swatchImage.imageOverlayLabel ? (
              <span className={classes.imageOverlayLabel}>{swatchImage ? swatchImage.imageOverlayLabel : ''}</span>
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
                  <span className={classes.asterix}>
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
        )}
      </Component>
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
