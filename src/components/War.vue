<template>
  <div class="war">
    <div class="war__name">
      {{ type }}
    </div>
    <div class="war__actions">
      <div
        class="action"
        v-for="(value, name) in getAtackConfig(double)"
        :key="name"
        @click="setAction(name)"
      >
        <div
          class="action__checkbox"
          :class="{ action__active: action === name }"
        ></div>
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'War',
  props: {
    double: Boolean,
    type: String,
    turn: Boolean,
  },
  data() {
    return {
      action: '',
    }
  },
  watch: {
    turn() {
      this.action = '';
    }
  },
  components: {
  },
  methods: {
    getAtackConfig(double: boolean) {
      let config: Record<string, string> = {
        Head: 'Head',
        Neck: 'Neck',
        Chest: 'Chest',
        Groin: 'Groin',
        Legs: 'Legs',
      }

      if (double) {
        config = {
          headNneck: 'Head & Neck',
          neckNchest: 'Neck & Chest',
          chestNgroin: 'Chest & Groin',
          groinNlegs: 'Groin & Legs',
          headNlegs: 'Head & Legs',
        }
      }

      return config;
    },
    setAction(action: string) {
      this.action = action;
      this.$emit('move', {[this.type as string]: action})
    },
  },
});
</script>

<style lang="scss">
  .war {
    width: 200px;
    &__name {
      text-transform: capitalize;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 10px;
    }
  }

  .action {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    &__checkbox {
      width: 15px;
      height: 15px;
      background-color: #CCCCCC;
      margin-right: 10px;
      position: relative;
    }
    &__active {
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background-color: #fff;
      }
    }
  }
</style>
