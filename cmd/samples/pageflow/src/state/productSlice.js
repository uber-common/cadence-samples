import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
    resetState: state => {
      const initialState = getInitialState();
      state.product.isLoading = initialState.isLoading;
      state.product.model = { ...initialState.modal };
      state.product.data = null;
    },
    updateModelField: (state, { payload: { target: { name, value } } }) => {
      state.model[name] = value;
    },
  },
});

export const {
  resetState,
  updateModelField,
} = productSlice.actions;

const setProduct = (state, action) => {
  state.data = { ...action.payload };
  state.model.name = action.payload.name;
  state.model.description = action.payload.description;
};

export const createProduct = createAsyncThunk(
  'product/create',
  async ({ dispatch, getState }) => {
    console.log('createProduct called?');

    const state = getState();
    const model = selectModelProduct(state);

    // TODO - trigger API call here...

    // TODO - API will set status
    model.status = 'DRAFT';

    setTimeout(() => {
      dispatch(setProduct(model));
    }, 1000);
  }
);

export const selectModelProduct = state => state.product.model;

export const selectModelProductDescription = state => state.product.model.description;

export const selectModelProductName = state => state.product.model.name;

export const selectProductStatus = state => state.product.data && state.product.data.status;

export default productSlice.reducer;
