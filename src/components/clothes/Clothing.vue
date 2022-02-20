<template>
  <div
    class="clothing"
    :style="getSize(type)"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    type: String
  },
  methods: {
    getSize(type: 'small' | 'medium' | 'big' | 'large' | 'weapon') {
      let sizes: Record<string, string> = {
        width: '70px',
        height: '70px',
      };

      if (type === 'medium') {
        sizes = {
          width: '140px',
          height: '70px',
        }
      }

      if (type === 'big') {
        sizes = {
          width: '140px',
          height: '140px',
        }
      }

      if (type === 'large') {
        sizes = {
          width: '140px',
          height: '190px',
        }
      }

      if (type === 'weapon') {
        sizes = {
          width: '140px',
          height: '210px',
          border: '10px solid #FFFFFF',
        }
      }

      return sizes;
    },
  },
})
</script>

<style>
  .clothing {
    background-color: #CCCCCC;
    background-size: cover;
    background-position: center;
  }
</style>