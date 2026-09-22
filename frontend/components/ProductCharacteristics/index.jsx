import React, {
  useCallback, useState, useEffect, useMemo,
} from 'react';
import {
  ProductCharacteristics as EngageProductCharacteristics,
} from '@shopgate/engage/product';
import { useCurrentProduct } from '@shopgate/engage/core';
import { PlaceholderParagraph } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import Characteristic from './components/Characteristic';
import ProductCharacteristicsProvider, { Context } from './Provider';
import config from '../../config.json';

const { bottomInset = 0, placeholderLines = 3 } = config;

const useStyles = makeStyles()(() => ({
  root: {
    marginBottom: bottomInset,
    ':empty': {
      display: 'none',
    },
    '& .ui-shared__placeholder-paragraph': {
      padding: 16,
    },
  },
  placeholder: {
    height: '0.875rem',
  },
}));

/**
 * ProductCharacteristics
 * @returns {JSX}
 */
const ProductCharacteristics = () => {
  const { classes, cx } = useStyles();
  const {
    productId,
    variantId,
    setCharacteristics,
    conditioner,
  } = useCurrentProduct();

  const [simulateFetching, setSimulateFetching] = useState(false);

  useEffect(() => {
    window.pdpVariantAccordionSimulateFetching = (simulate = true) => {
      setSimulateFetching(simulate);
    };
  }, []);

  const renderCharacteristic = useCallback(
    renderProps => <Characteristic {...renderProps} />,
    []
  );

  /**
   * The characteristics element is memoized to keep its identity stable. Otherwise it would
   * re-render whenever the provider context updates, e.g. when a characteristic is opened.
   */
  const characteristics = useMemo(() => (
    <EngageProductCharacteristics
      productId={productId}
      variantId={variantId}
      conditioner={conditioner}
      setCharacteristics={setCharacteristics}
      finishTimeout={200}
      render={renderCharacteristic}
    />
  ), [conditioner, productId, renderCharacteristic, setCharacteristics, variantId]);

  return (
    <div className={cx(classes.root, 'pdp-variant-accordion')}>
      <ProductCharacteristicsProvider productId={productId} variantId={variantId}>
        <Context.Consumer>
          {({ isFetching }) => (
            <PlaceholderParagraph
              ready={!simulateFetching && !isFetching}
              lines={placeholderLines}
              className={classes.placeholder}
            >
              {characteristics}
            </PlaceholderParagraph>
          )}
        </Context.Consumer>
      </ProductCharacteristicsProvider>
    </div>
  );
};

export default ProductCharacteristics;
