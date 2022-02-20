<template>
  <div class="logs">
    <div
      class="log"
      v-for="(log, index) in logs" :key="index"
    >
      <p v-if="index < logs.length - 1" class="log__you"><span>You:</span> {{log.you}}</p>
      <p v-if="index < logs.length - 1" class="log__opponent"><span>Opponent:</span> {{log.opponent}}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    logs: Array,
  },
});
</script>

<style lang="scss">
  .logs {
    padding: 20px;
    max-height: 300px;
    overflow: auto;
    .log {
      margin-bottom: 10px;
      &__you {
        & > span {
          font-weight: bold;
          color: seagreen;
        }
      }
      &__opponent {
        & > span {
          font-weight: bold;
          color: crimson;
        }
      }
    }
  }
</style>