import { describe, expect, it} from 'vitest'

import isAccessTokenInvalidError, {isTokenError} from '../isTokenInvalidError'

describe('isTokenError', () => {
  it('should return true for valid TokenError objects', () => {
    const error = {
      code: 'some_code',
      messages: [{ token_type: 'access' }]
    };
    expect(isTokenError(error)).toBeTruthy();
  });

  it('should return false for invalid objects', () => {
    const error = {
      invalidProp: 'some_value'
    };
    expect(isTokenError(error)).toBeFalsy();
  });

});

describe('isAccessTokenInvalidError', () => {
  it('should return true for access token invalid errors', () => {
    const error = {
      code: 'token_not_valid',
      messages: [{ token_type: 'access' }]
    };
    expect(isAccessTokenInvalidError(error)).toBeTruthy();
  });

  it('should return false for other types of errors', () => {
    const error = {
      code: 'token_not_valid',
      messages: [{ token_type: 'refresh' }]
    };
    expect(isAccessTokenInvalidError(error)).toBeFalsy();
  });

  it('message not token invalid error', () => {
    const error = {
      code: 'token_not',
      messages: [{ token_type: 'access' }]
    };
    expect(isAccessTokenInvalidError(error)).toBeFalsy();
  });

});
