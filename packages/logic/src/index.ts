import { accountReducer } from '@smoex-business/user'
import { createSlice } from 'redux-async-kit'

export const homeSlice = createSlice('home', {
    account: accountReducer,
    account2: accountReducer,
})