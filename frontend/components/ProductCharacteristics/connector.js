import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import {
  getProductVariants,
  hasProductVariants,
} from '@shopgate/engage/product';
import { getColorCharacteristic, getColorImageCharacteristic } from '../../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const variants = getProductVariants(state, props);
  const hasVariants = hasProductVariants(state, props);

  // Check if base product has only a single characteristic (required be able to show prices)
  const hasSingleCharacteristic =
    variants &&
    Array.isArray(variants.characteristics) &&
    variants.characteristics.length === 1;

  return {
    isFetching: !!hasVariants && !variants,
    products: hasSingleCharacteristic ? variants.products : null,
    characteristics: variants ? variants.characteristics : [],
    colorCharacteristic: getColorCharacteristic(state, props),
    colorImageCharacteristic: getColorImageCharacteristic(state, props),
  };
};

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.characteristics, next.characteristics)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
