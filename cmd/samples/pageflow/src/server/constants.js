export const ALLOWED_STATE_ON_STATUS_MAP = {
  approve: ['submitted'],
  reject: ['submitted'],
  submit: ['created', 'withdrawn'],
  withdraw: ['submitted'],
};

export const EXPECTED_STATUS_FROM_STATE = {
  approve: 'approved',
  create: 'created',
  reject: 'created',
  save: 'created',
  submit: 'submitted',
  withdraw: 'withdrawn',
};
