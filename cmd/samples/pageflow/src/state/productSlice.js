import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';

const getInitialState = () => {
  return {
    isLoading: false,

    model: {
      name: 'PRODUCT_NAME',
      description: 'PRODUCT_DESCRIPTION',
    },

    data: null,
  };
};

export const productSlice = createSlice({
  name: 'product',
  initialState: getInitialState(),
  reducers: {
    resetProductModel: state => {
      const initialState = getInitialState();
      state.model = { ...initialState.model };
    },
    resetProductState: state => {
      const initialState = getInitialState();

      state.isLoading = initialState.isLoading;
      state.model = { ...initialState.model };
      state.data = null;
    },
    setProduct: (state, action) => {
      state.data = { ...action.payload };
    },
    updateProductModel: (state, { payload: { target: { name, value } } }) => {
      state.model[name] = value;
    },
  },
});

export const {
  resetProductModel,
  resetProductState,
  setProduct,
  updateProductModel,
} = productSlice.actions;

export const createProduct = createAsyncThunk(
  'product/create',
  async (event, { dispatch, getState }) => {
    event.preventDefault();

    const state = getState();
    const model = selectModelProduct(state);

    // TODO - trigger API call here...

    setTimeout(() => {
      // TODO - API will set ID & status
      const id = 'abc';
      const status = 'DRAFT';
      const response = { ...model, id, status };

      dispatch(setProduct(response));
      dispatch(push(`/products/${id}`));
    }, 1000);
  }
);

export const selectModelProduct = state => state.product.model;

export const selectProduct = state => state.product.data;

export const selectProductStatus = state => state.product.data && state.product.data.status;

export default productSlice.reducer;
