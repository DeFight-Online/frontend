<template>
  <Header :signIn="signIn" :walletConnection="walletConnection"/>
  <router-view/>
</template>

<script lang="ts">
import Header from '@/components/header/Header.vue';
import getConfig from '@/config/nearConfig';
import * as nearAPI from 'near-api-js';
import { Near } from 'near-api-js';
import store from '@/store';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      contract: {} as any,
      near: {} as Near,
      nearConfig: getConfig('testnet'),
      walletConnection: {} as any,
    }
  },
  components: {
    Header,
  },
  async mounted() {
    await this.connectToNearAPI();
  },
  methods: {
    async connectToNearAPI() {
      this.near = await nearAPI.connect({
        deps: {
          keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
        },
        ...this.nearConfig,
        headers: {},
      });
      await this.connectToWallet();
      await this.initContract();
      await this.getEquipment();
      await this.getTokenSeries();
    },
    async connectToWallet() {
      this.walletConnection = new nearAPI.WalletConnection(this.near, null);
      store.commit('setWalletConnection', this.walletConnection);
    },
    async initContract() {
      this.contract = await new nearAPI.Contract(this.walletConnection.account(), this.nearConfig.contractName, {
        // View methods are read-only – they don't modify the state, but usually return some value
        viewMethods: ['get_battle', 'get_token_series', 'get_warrior_equipment'],
        // Change methods can modify the state, but you don't receive the returned value when called
        changeMethods: ['start_battle', 'make_action', 'change_warrior_equipment'],
        // Sender is the account ID to initialize transactions.
        // getAccountId() will return empty string if user is still unauthorized
        // sender: this.walletConnection.getAccountId()
      });
      store.commit('setContract', this.contract);
    },
    async signIn() {
      this.walletConnection.requestSignIn(this.nearConfig.contractName, 'Defight');
    },
    async getEquipment() {
      const equip = await this.contract.get_warrior_equipment({account_id: this.walletConnection?._authData?.accountId});
      store.commit('setBaseEquipment', equip);
    },
    async getTokenSeries() {
      const tokenSeries = await this.contract.get_token_series({
        from_index: 0,
        limit: 200,
      });
      store.commit('setTokenSeries', tokenSeries);
    }
  },
});
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Lato', sans-serif;
  }
</style>
