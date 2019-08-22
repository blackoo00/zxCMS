import { addProd,editProd,delProd } from "@/services/api";

export default {
    namespace: 'prod',
    state:{
        list:[],
        detail:null
    },
    effects: {
        *add({payload}, {call}){
            const res = yield call(addProd, payload)
            return res
        },
        *edit({payload}, {call}){
            const res = yield call(editProd, payload)
            return res
        },
        *del({payload}, {call}){
            const res = yield call(delProd, payload)
            return res
        },
        *getDetail({ payload }, { call, put}){
            // const data = yield call(queryProdDetail, payload)
            // yield put({
            //     type: 'queryProdDetail',
            //     payload: data
            // })
        }
    },
    reducers: {
        queryProdDetail(state, action) {
            return {
              ...state,
              detail: action.payload
            };
          },
    }
}