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

  const { getSwatchColor } = useProductCharacteristics();

  const clickable = useMemo(() => typeof onClick === 'function', [onClick]);

  // Determine if the value needs to be displayed as a swatch
  const swatchColor = useMemo(() => getSwatchColor({
    id: characteristicId,
    label: characteristicLabel,
  }, value), [value, characteristicId, characteristicLabel, getSwatchColor]);

  const classes = useMemo(() => classNames(
    styles.root,
    className,
    'pdp-variant-accordion__characteristic__value',
    {
      [styles.selected]: clickable && selected,
      [styles.disabled]: !selectable,
      selected: clickable && selected,
      disabled: !selectable,
    }
  ), [className, selectable, selected, clickable]);

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
    <Component className={classes}>
      { swatchColor ? (
        <span className={styles.swatch} style={{ background: swatchColor }}>&nbsp;</span>
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
