<template>
  <button
    class="actionButton"
    :class="{
      [`actionButton__${view}`]: view,
      actionButton__active: active,
    }"
    @click="action()"
  >
    {{text}}
  </button>
</template>

<script>
export default {
  props: {
    text: String,
    action: Function,
    view: String,
    active: Boolean,
  }
}
</script>

<style lang="scss">
  .actionButton {
    min-width: 100px;
    background: none;
    border: none;
    outline: none;
    padding: 10px 20px;
    font-size: 16px;
    border: 2px solid transparent;
    &__action {
      border: 2px solid #01BAEF;
      border-radius: 25px;
    }
    &__active {
      background-color: #01BAEF;
      color: #fff;
      cursor: pointer;
    }
  }
</style>