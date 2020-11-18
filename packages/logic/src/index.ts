import { accountReducer } from '@smoex-logic/user'
import { createSlice } from '@react-kits/redux'

export const homeSlice = createSlice('home', {
    account: accountReducer,
    account2: accountReducer,
})