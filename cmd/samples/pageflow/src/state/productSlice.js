import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import get from 'lodash.get';
import { productService } from '../service';

const getInitialState = () => {
  return {
    model: {
      name: '',
      description: '',
    },

    data: {},

    error: null,
  };
};

export const productSlice = createSlice({
  name: 'products',
  initialState: getInitialState(),
  reducers: {
    resetProductError: state => {
      state.error = null;
    },
    resetProductModel: state => {
      const initialState = getInitialState();
      state.model = { ...initialState.model };
    },
    resetProductDescription: (state, action) => {
      state.model.description = get(state, `data[${action.payload}].description`, '');
    },
    updateProduct: (state, action) => {
      state.data[action.payload.name] = action.payload;
    },
    updateProductError: (state, action) => {
      state.error = action.payload && (action.payload.message || 'unknown server error');
    },
    updateProductModel: (state, { payload: { target: { name, value } } }) => {
      state.model[name] = value;
    },
  },
});

export const {
  resetProductError,
  resetProductModel,
  resetProductDescription,
  updateProduct,
  updateProductError,
  updateProductModel,
} = productSlice.actions;

export const createProduct = createAsyncThunk(
  'products/create',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const model = selectModelProduct(state);

    try {
      dispatch(resetProductError());
      const product = await productService.createProduct(model);
      dispatch(updateProduct(product));
      dispatch(push(`/products/${product.name}`));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetch',
  async (productName, { dispatch, getState }) => {
    const state = getState();
    const product = selectProduct(state, productName);
    if (product) {
      return product;
    }

    try {
      dispatch(resetProductError());
      const productResponse = await productService.fetchProduct(productName);
      dispatch(updateProduct(productResponse));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const updateProductDescription = createAsyncThunk(
  'products/save',
  async (productName, { dispatch, getState }) => {
    const state = getState();
    const { description } = selectModelProduct(state);

    try {
      dispatch(resetProductError());
      const product = await productService.updateProductDescription({
        description: description,
        name: productName,
      });
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const updateProductState = createAsyncThunk(
  'products/state',
  async({ name, state }, { dispatch }) => {
    try {
      dispatch(resetProductError());
      const product = await productService.updateProductState({ name, state });
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const selectModelProduct = state => state.products.model;

export const selectProduct = (state, name) => state.products.data[name];

export const selectProductError = state => state.products.error;

export default productSlice.reducer;
