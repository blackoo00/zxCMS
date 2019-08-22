import {
  queryFakeList,
  queryProdList,
  queryCatgList,
  queryOrderList,
  queryCatgAll,
  addCat,
  editCat,
  delCat,
} from '@/services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
    prodlist: [],
    catelist: [],
    orderlist: [],
  },

  effects: {
    *fetchProds({ payload }, { call, put }) {
      const response = yield call(queryProdList, payload);
      return response
      // yield put({
      //   type: 'queryProdList',
      //   payload: Array.isArray(response.data) ? response.data : [],
      // });
    },
    *getCatAll(_,{call}){
      const res = yield call(queryCatgAll)
      return res
    },
    *fetchCates({ payload }, { call, put }) {
      const response = yield call(queryCatgList, payload);
      return response
      // yield put({
      //   type: 'queryCatgList',
      //   payload: Array.isArray(response.data) ? response.data : [],
      // });
    },
    *fetchOrders({ payload }, { call, put }) {
      const response = yield call(queryOrderList, payload);
      yield put({
        type: 'queryOrderList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *create({ payload }, { call }) {
      const response = yield call(addCat, payload); // post
      return response
    },
    *edit({ payload }, { call }) {
      const response = yield call(editCat, payload); // post
      return response
    },
    *del({ payload }, { call }) {
      const response = yield call(delCat, payload); // post
      return response
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryProdList(state, action) {
      return {
        ...state,
        list: action.payload,
        prodlist: action.payload,
      };
    },
    queryCatgList(state, action) {
      return {
        ...state,
        catelist: action.payload,
      };
    },
    queryOrderList(state, action) {
      return {
        ...state,
        orderlist: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
