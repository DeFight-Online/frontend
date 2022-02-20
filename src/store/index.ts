import { createStore } from 'vuex'

export default createStore({
  state: {
    loader: false,
    contract: {} as any,
    parasContract: {} as any,
    walletConnection: {} as any,
    tokenSeries: [] as any,
    baseEquipment: {
      helmet: null,
      armor: null,
      gloves: null,
      bracers: null,
      shoulder_pads: null,
      leggings: null,
      boots: null,
      amulet: null,
      weapon_1: null,
      weapon_2: null,
    } as any,
  },
  mutations: {
    setLoader({ loader }, loadingState: boolean) {
      loader = loadingState;
    },
    setContract(state, data) {
      state.contract = data;
    },
    setParasContract(state, data) {
      state.parasContract = data;
    },
    setWalletConnection(state, data) {
      state.walletConnection = data;
    },
    setTokenSeries(state, data) {
      state.tokenSeries = data;
    },
    setBaseEquipment(state, baseEquipment) {
      state.baseEquipment = baseEquipment;
    },
  },
  actions: {
  },
  modules: {
  }
})
