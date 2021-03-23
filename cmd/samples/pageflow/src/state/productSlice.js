import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';

const getInitialState = () => {
  return {
    isLoading: false,

    model: {
      name: 'PRODUCT_NAME',
      description: 'PRODUCT_DESCRIPTION',
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
  updateProduct,
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

      dispatch(updateProduct(response));
      dispatch(push(`/products/${id}`));
    }, 1000);
  }
);

export const selectModelProduct = state => state.products.model;
export const selectModelProductName = state => selectModelProduct(state).name;
export const selectModelProductDescription = state => selectModelProduct(state).description;

export const selectProduct = (state, id) => state.products.data[id] || {};
export const selectProductName = (state, id) => selectProduct(state, id).name || 'UNKNOWN';
export const selectProductDescription = (state, id) => selectProduct(state, id).description || 'UNKNOWN';
export const selectProductStatus = (state, id) => selectProduct(state, id).status || 'UNKNOWN';

export default productSlice.reducer;
