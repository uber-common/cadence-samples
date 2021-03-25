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
    resetProductModel: state => {
      const initialState = getInitialState();
      state.model = { ...initialState.model };
    },
    resetProductDescription: (state, action) => {
      state.model.description = get(state, `data[${action.payload}].description`, 'UNKNOWN');
    },
    updateProduct: (state, action) => {
      state.data[action.payload.id] = action.payload;
    },
    updateProductError: (state, action) => {
      state.error = action.payload && action.payload.message;
    },
    updateProductModel: (state, { payload: { target: { name, value } } }) => {
      state.model[name] = value;
    },
  },
});

export const {
  resetProductModel,
  resetProductDescription,
  updateProduct,
  updateProductError,
  updateProductModel,
} = productSlice.actions;

export const approveProduct = createAsyncThunk(
  'products/approve',
  async (productId, { dispatch }) => {
    const product = await productService.approveProduct(productId);

    try {
      dispatch(updateProductError(null));
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const model = selectModelProduct(state);

    try {
      dispatch(updateProductError(null));
      const product = await productService.createProduct(model);
      dispatch(updateProduct(product));
      dispatch(push(`/products/${product.id}`));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/create',
  async (productId, { dispatch, getState }) => {
    const state = getState();
    const product = selectProduct(state, productId);
    if (product) {
      return product;
    }

    try {
      dispatch(updateProductError(null));
      const productResponse = await productService.fetchProduct(productId);
      dispatch(updateProduct(productResponse));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const rejectProduct = createAsyncThunk(
  'products/reject',
  async (productId, { dispatch }) => {
    try {
      dispatch(updateProductError(null));
      const product = await productService.rejectProduct(productId);
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const submitProduct = createAsyncThunk(
  'products/submit',
  async (productId, { dispatch }) => {
    try {
      dispatch(updateProductError(null));
      const product = await productService.submitProduct(productId);
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const updateProductDescription = createAsyncThunk(
  'products/update-description',
  async (productId, { dispatch, getState }) => {
    const state = getState();
    const { description } = selectModelProduct(state);

    try {
      dispatch(updateProductError(null));
      const product = await productService.updateProductDescription({
        description: description,
        id: productId,
      });
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const withdrawProduct = createAsyncThunk(
  'products/approve',
  async (productId, { dispatch }) => {
    try {
      dispatch(updateProductError(null));
      const product = await productService.withdrawProduct(productId);
      dispatch(updateProduct(product));
    } catch (error) {
      dispatch(updateProductError(error));
    }
  }
);

export const selectModelProduct = state => state.products.model;

export const selectProduct = (state, id) => state.products.data[id];

export const selectProductError = state => state.products.error;

export default productSlice.reducer;
