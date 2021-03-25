import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import get from 'lodash.get';
import { productService } from '../service';

const getInitialState = () => {
  return {
    isLoading: false,

    model: {
      name: '',
      description: '',
    },

    data: {},
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
    updateProductModel: (state, { payload: { target: { name, value } } }) => {
      state.model[name] = value;
    },
  },
});

export const {
  resetProductModel,
  resetProductDescription,
  updateProduct,
  updateProductModel,
} = productSlice.actions;

export const approveProduct = createAsyncThunk(
  'products/approve',
  async (productId, { dispatch }) => {
    const product = await productService.approveProduct(productId);
    dispatch(updateProduct(product));
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const model = selectModelProduct(state);

    const product = await productService.createProduct(model);
    dispatch(updateProduct(product));
    dispatch(push(`/products/${product.id}`));
  }
);

export const rejectProduct = createAsyncThunk(
  'products/reject',
  async (productId, { dispatch }) => {
    const product = await productService.rejectProduct(productId);
    dispatch(updateProduct(product));
  }
);

export const submitProduct = createAsyncThunk(
  'products/submit',
  async (productId, { dispatch }) => {
    const product = await productService.submitProduct(productId);
    dispatch(updateProduct(product));
  }
);

export const updateProductDescription = createAsyncThunk(
  'products/update-description',
  async (productId, { dispatch, getState }) => {
    const state = getState();
    const { description } = selectModelProduct(state);
    const product = await productService.updateProductDescription({
      description: description,
      id: productId,
    });
    dispatch(updateProduct(product));
  }
);

export const withdrawProduct = createAsyncThunk(
  'products/approve',
  async (productId, { dispatch }) => {
    const product = await productService.withdrawProduct(productId);
    dispatch(updateProduct(product));
  }
);

export const selectModelProduct = state => state.products.model;

export const selectProduct = (state, id) => state.products.data[id] || {
  id: null,
  name: 'UNKNOWN',
  description: 'UNKNOWN',
  status: 'UNKNOWN',
};

export default productSlice.reducer;
