export const ALLOWED_STATE_ON_STATUS_MAP = {
  approve: ['submitted'],
  reject: ['submitted'],
  submit: ['created', 'withdrawn'],
  withdraw: ['submitted'],
};
