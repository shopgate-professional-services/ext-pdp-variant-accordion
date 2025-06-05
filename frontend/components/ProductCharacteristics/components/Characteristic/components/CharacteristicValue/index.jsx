import React, {
  Fragment, memo, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Price, PriceStriked, HtmlSanitizer } from '@shopgate/engage/components';
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
  imageSwatchSize,
  imageSwatchBackgroundSize,
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
  container: css({
    display: 'block',
    textAlign: 'center',
  }).toString(),
  priceContainer: css({
    display: 'block',
    position: 'relative',
  }).toString(),
  priceStriked: css({
    fontSize: '1.25rem',
  }).toString(),
  price: css({
    display: 'inline-block',
    color: colors.primary,
    fontSize: '1.5rem',
    fontWeight: 600,
  }).toString(),
  asterix: css({
    fontSize: '1.5rem',
    fontWeight: 300,
  }),
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
    lineHeight: `${imageSwatchSize}px`,
    color: imageOverlayLabelColor || '#fff',
  }).toString(),
  labelBelowSwatch: css({
    marginTop: '4px',
    fontSize: '0.6rem',
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
                backgroundSize: imageSwatchBackgroundSize,
                width: `${imageSwatchSize}px`,
                height: `${imageSwatchSize}px`,
              }}
            >
              { swatchImage && swatchImage.imageOverlayLabel ? (
                <span className={styles.imageOverlayLabel}>{swatchImage ? swatchImage.imageOverlayLabel : ''}</span>
              ) : null}
            </span>
          </>
        ) : (
          <Fragment>
            <div className={styles.container}>
              <span>
                {label}
              </span>
              <div className={styles.priceContainer}>
                {priceStriked ? (
                  <>
                    <PriceStriked
                      value={priceStriked}
                      currency={currency}
                      className={styles.priceStriked}
                    />
                  </>
                ) : null}
                {currency ? (
                  <>
                    <Price
                      unitPrice={unitPrice}
                      currency={currency}
                      className={styles.price}
                    />
                    <span className={styles.asterix}>
                      {'*'}
                    </span>
                  </>
                ) : null}
                <span className={styles.basePrice}>
                  { basePrice ? (
                    <>
                      <HtmlSanitizer>
                        {basePrice}
                      </HtmlSanitizer>
                    </>
                  ) : null}
                </span>
              </div>
            </div>
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
