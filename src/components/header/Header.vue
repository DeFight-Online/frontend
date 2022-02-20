<template>
  <header class="header">
    <nav class="header__nav">
      <router-link v-if="walletConnection?._authData?.accountId" to="/inventory">Inventory</router-link>
      <router-link v-if="walletConnection?._authData?.accountId" to="/">Battle</router-link>
    </nav>
    <action-button
      view="action"
      :action="!walletConnection?._authData?.accountId ? signIn : null"
      :text="!walletConnection?._authData?.accountId ? 'Connect Wallet' : walletConnection?._authData?.accountId"
      :active="!walletConnection?._authData?.accountId"
    />
  </header>
</template>

<script>
import ActionButton from '@/components/buttons/ActionButton.vue';

export default {
  name: 'Header',
  props: {
    signIn: Function,
    walletConnection: Object,
  },
  components: {
    ActionButton,
  },
}
</script>

<style lang="scss">
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    &__connect {
      padding: 10px 20px;
      border: 2px solid #01BAEF;
      border-radius: 25px;
      &Active {
        background-color: #01BAEF;
        color: #fff;
        cursor: pointer;
      }
    }
    &__nav {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      & > a {
        margin-right: 20px;
      }
    }
  }
</style>