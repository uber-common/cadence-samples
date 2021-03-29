export const ALLOWED_STATE_ON_STATUS_MAP = {
  approve: ['submitted'],
  reject: ['submitted'],
  submit: ['created', 'withdrawn'],
  withdraw: ['submitted'],
};

export const EXPECTED_STATUS_FROM_STATE = {
  approve: 'approved',
  reject: 'created',
  submit: 'submitted',
  withdraw: 'withdrawn',
};
