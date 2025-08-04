'use client'

import React from 'react'
import { store, persistor } from '@/store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './Loading'

function GlobalProvider({ children }) {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={<Loading />}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default GlobalProvider