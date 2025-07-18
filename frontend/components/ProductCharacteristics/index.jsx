import React, { useCallback, useState, useEffect } from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import {
  ProductCharacteristics as EngageProductCharacteristics,
} from '@shopgate/engage/product';
import { useCurrentProduct } from '@shopgate/engage/core';
import { PlaceholderParagraph } from '@shopgate/engage/components';
import Characteristic from './components/Characteristic';
import ProductCharacteristicsProvider, { Context } from './Provider';

import config from '../../config';

const { bottomInset = 0, placeholderLines = 3 } = config;

const styles = {
  root: css({
    marginBottom: bottomInset,
    ':empty': {
      display: 'none',
    },
    '& .ui-shared__placeholder-paragraph': css({
      padding: 16,
    }),
  }).toString(),
  placeholder: css({
    height: '0.875rem',
  }).toString(),
};

/**
 * ProductCharacteristics
 * @returns {JSX}
 */
const ProductCharacteristics = () => {
  const {
    productId,
    variantId,
    setCharacteristics,
    conditioner,
  } = useCurrentProduct();

  const [simulateFetching, setSimulateFetching] = useState(false);

  /**
   * Effect to set up a global function that allows to simulate the fetching state.
   * Can be useful when placeholder styling is supposed to be adjusted.
   */
  useEffect(() => {
    window.pdpVariantAccordionSimulateFetching = (simulate = true) => {
      setSimulateFetching(simulate);
    };
  }, []);

  const renderCharacteristic = useCallback(
    renderProps => (<Characteristic {...renderProps} />),
    []
  );

  return (
    <div className={classNames(styles.root, 'pdp-variant-accordion')}>
      <ProductCharacteristicsProvider productId={productId} variantId={variantId}>
        <Context.Consumer>
          {({ isFetching }) => (
            <PlaceholderParagraph
              ready={!simulateFetching && !isFetching}
              lines={placeholderLines}
              className={styles.placeholder}
            >
              <EngageProductCharacteristics
                productId={productId}
                variantId={variantId}
                conditioner={conditioner}
                setCharacteristics={setCharacteristics}
                finishTimeout={200}
                render={renderCharacteristic}
              />

            </PlaceholderParagraph>
          )}
        </Context.Consumer>

      </ProductCharacteristicsProvider>
    </div>
  );
};

export default ProductCharacteristics;
