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
      console.log('initialState = ', JSON.stringify(initialState));

      state.isLoading = initialState.isLoading;
      state.model = { ...initialState.model };
      state.data = null;
      console.log('state = ', JSON.stringify(state));
    },
    setProduct: (state, action) => {
      state.data = { ...action.payload };
    },
    updateProductModel: (state, { payload: { target: { name, value } } }) => {
      console.log('state = ', JSON.stringify(state));
      console.log('name = ', name);
      console.log('value = ', value);
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
    console.log('createProduct called?');

    event.preventDefault();

    const state = getState();
    const model = selectModelProduct(state);
    console.log('model = ', model);

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

export const selectModelProductDescription = state => state.product.model.description;

export const selectModelProductName = state => state.product.model.name;

export const selectProductStatus = state => state.product.data && state.product.data.status;

export default productSlice.reducer;
