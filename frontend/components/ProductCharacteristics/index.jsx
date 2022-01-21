import React, { useCallback } from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import {
  ProductCharacteristics as EngageProductCharacteristics,
} from '@shopgate/engage/product';
import { useCurrentProduct } from '@shopgate/engage/core';
import Characteristic from './components/Characteristic';
import ProductCharacteristicsProvider from './Provider';

import config from '../../config';

const { bottomInset = 0 } = config;

const styles = {
  root: css({
    paddingBottom: bottomInset,
    ':empty': {
      display: 'none',
    },
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

  const renderCharacteristic = useCallback(
    renderProps => (<Characteristic {...renderProps} />),
    []
  );

  return (
    <div className={classNames(styles.root, 'pdp-variant-accordion')}>
      <ProductCharacteristicsProvider productId={productId} variantId={variantId}>
        <EngageProductCharacteristics
          productId={productId}
          variantId={variantId}
          conditioner={conditioner}
          setCharacteristics={setCharacteristics}
          finishTimeout={200}
          render={renderCharacteristic}
        />
      </ProductCharacteristicsProvider>
    </div>
  );
};

export default ProductCharacteristics;
