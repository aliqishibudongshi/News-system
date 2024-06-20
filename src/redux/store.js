import { legacy_createStore as createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { loadingReducer } from "./reducers/loadingReducer";

const persistConfig = {  
    key: 'root',  
    storage
}

const reducer = combineReducers({
    loadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer) // 把我们的reducer按照持久化配置中说明的key存放在storage中，生成一个持久化reducer。
let store = createStore(persistedReducer); // 把生成的持久化reducer给store。
let persistor = persistStore(store); // 通过persistStore把我们的store变成持久器。

export {store, persistor}