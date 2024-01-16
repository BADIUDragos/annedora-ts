import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react';
import { useAuth } from '../authSliceHooks';
import setupStore from '../..';
import { createAuthState } from '../../slices/__tests__/authSetups';
import { getWrapper } from '../../../__testUtils__/testStores';


describe('useAuth hook', () => {
  const initialState = createAuthState()
  const store = setupStore({ auth: initialState});
  
  it('should return auth data from useSelector', () => {
   
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper(store) });

    expect(result.current.tokens!.access).toEqual(initialState.tokens?.access);
    expect(result.current.tokens!.refresh).toEqual(initialState.tokens?.refresh);
    expect(result.current.userInfo!.id).toEqual(initialState.userInfo?.id);
    expect(result.current.userInfo!.username).toEqual(initialState.userInfo?.username);
    expect(result.current.userInfo!.email).toEqual(initialState.userInfo?.email);
    expect(result.current.userInfo!.isSuperuser).toEqual(initialState.userInfo?.isSuperuser);
    expect(result.current.userInfo!.isStaff).toEqual(initialState.userInfo?.isStaff);
  });
});