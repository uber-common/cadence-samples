import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import get from 'lodash.get';

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

export const createProduct = createAsyncThunk(
  'products/create',
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

export const submitProduct = createAsyncThunk(
  'products/submit',
  async (productId, { dispatch, getState }) => {
    const state = getState();
    const product = selectProduct(state, productId);

    // TODO - trigger API call here...

    setTimeout(() => {
      // TODO - API will set ID & status
      const status = 'SUBMITTED';
      const response = { ...product, status };

      dispatch(updateProduct(response));
    }, 1000);
  }
);

export const rejectProduct = createAsyncThunk(
  'products/reject',
  async (productId, { dispatch, getState }) => {
    const state = getState();
    const product = selectProduct(state, productId);

    // TODO - trigger API call here...

    setTimeout(() => {
      // TODO - API will set ID & status
      const status = 'REJECTED';
      const response = { ...product, status };

      dispatch(updateProduct(response));
    }, 1000);
  }
);

export const approveProduct = createAsyncThunk(
  'products/approve',
  async (productId, { dispatch, getState }) => {
    const state = getState();
    const product = selectProduct(state, productId);

    // TODO - trigger API call here...

    setTimeout(() => {
      // TODO - API will set ID & status
      const status = 'APPROVED';
      const response = { ...product, status };

      dispatch(updateProduct(response));
    }, 1000);
  }
);

export const updateProductDescription = createAsyncThunk(
  'products/update-description',
  async (productId, { dispatch, getState }) => {
    const state = getState();
    const description = selectModelProductDescription(state);
    const product = selectProduct(state, productId);

    // TODO - trigger API call here...

    setTimeout(() => {
      // TODO - API will set ID & status
      const response = { ...product, description };

      dispatch(updateProduct(response));
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

export const selectIsModelProductDescriptionEqual = (state, id) => Boolean(selectModelProductDescription(state) === selectProductDescription(state, id));

export default productSlice.reducer;
