import { useContext } from 'react';
import { VariantContext } from '@shopgate/engage/product';
import { Context } from './Provider';

/**
 * Use product characteristics hook
 * @returns {Object}
 */
export const useProductCharacteristics = () => useContext(Context);

/**
 * Use variants hook
 * @returns {Object}
 */
export const useVariants = () => useContext(VariantContext);
