<template>
  <div class="avatar">
    <div class="name">
      <span v-if="warrior.account_id.includes('(bot)')">Bot</span>
      <span v-else>{{warrior.account_id}}</span>
    </div>
    <div class="stats">
      <span class="stats__points">
        {{warrior?.health || 0}}/{{warrior?.stamina * 10 || 0}}
      </span>
      <div
        class="stats__health"
        :style="{
          background: getHealhState.color,
          'width': getHealhState.percents + '%',
        }"
      >
      </div>
    </div>
    <div class="grid">
      <div class="grid__left">
        <Clothing @click="unEquip && unEquip('helmet')" :class="{curpo: unEquip && equipment?.helmet}" type="big" :style="{'background-image': equipment?.helmet ? imageUrl(equipment?.helmet) : 'url(' + require('../assets/sets/empty/hat.png') + ')'}"/>
        <Clothing @click="unEquip && unEquip('armor')" :class="{curpo: unEquip && equipment?.armor}" type="large" :style="{'background-image': equipment?.armor ? imageUrl(equipment?.armor) : 'url(' + require('../assets/sets/empty/chest.png') + ')'}"/>
        <Clothing @click="unEquip && unEquip('bracers')" :class="{curpo: unEquip && equipment?.bracers}" type="medium" :style="{'background-image': equipment?.bracers ? imageUrl(equipment?.bracers) : 'url(' + require('../assets/sets/empty/hands.png') + ')'}"/>
        <Clothing @click="unEquip && unEquip('gloves')" type="medium" :style="{'background-image': equipment?.gloves ? imageUrl(equipment?.gloves) : 'url(' + require('../assets/sets/empty/gloves.png') + ')'}"/>
      </div>
      <div class="grid__center">
        <Clothing @click="unEquip && unEquip('weapon_1')" :class="{curpo: unEquip && equipment?.weapon_1}" type="weapon" :style="{'background-image': equipment?.weapon_1 ? imageUrl(equipment?.weapon_1) : 'url(' + require('../assets/sets/empty/sword.png') + ')'}"/>
        <Clothing @click="unEquip && unEquip('weapon_2')" :class="{curpo: unEquip && equipment?.weapon_2}" type="weapon" :style="{'background-image': equipment?.weapon_2 ? imageUrl(equipment?.weapon_2) : 'url(' + require('../assets/sets/empty/axe.png') + ')'}"/>
      </div>
      <div class="grid__right">
        <Clothing @click="unEquip && unEquip('shoulder_pads')" :class="{curpo: unEquip && equipment?.shoulder_pads}" type="big" :style="{'background-image': equipment?.shoulder_pads ? imageUrl(equipment?.shoulder_pads) : 'url(' + require('../assets/sets/empty/shoulders.png') + ')'}"/>
        <Clothing @click="unEquip && unEquip('leggings')" :class="{curpo: unEquip && equipment?.leggings}" type="large" :style="{'background-image': equipment?.leggings ? imageUrl(equipment?.leggings) : 'url(' + require('../assets/sets/empty/legs.png') + ')'}"/>
        <Clothing @click="unEquip && unEquip('boots')" :class="{curpo: unEquip && equipment?.boots}" type="big" :style="{'background-image': equipment?.boots ? imageUrl(equipment?.boots) : 'url(' + require('../assets/sets/empty/boots.png') + ')'}"/>
      </div>
      <div class="grid__bottom">
        <Clothing type="small"/>
        <Clothing type="small"/>
        <Clothing type="small"/>
        <Clothing type="medium"/>
        <Clothing type="small"/>
        <Clothing type="small"/>
        <Clothing type="small"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Clothing from '@/components/clothes/Clothing.vue';
import store from '@/store';

export default defineComponent({
  name: 'Avatar',
  props: {
    warrior: Object,
    equipment: Object,
    unEquip: Function,
  },
  components: {
    Clothing,
  },
  computed: {
    tokenSeries(): any[] {
      return store.state.tokenSeries;
    },
    getHealhState(): Record<string, any> {
      const fullHP = this.warrior?.stamina * 10;
      const percents = this.warrior?.health * 100 / fullHP;
      let color = "#33CC99";
      if (percents <= 70 && percents > 30) {
        color = '#ffcc00';
      }
      if (percents <= 30) {
        color = '#cc3300';
      }

      return {
        color,
        percents,
      };
    },
  },
  methods: {
    imageUrl(token_series_id: string) {
      const hash = this.tokenSeries.find((s: any) => s[0] === token_series_id.split(':')[0])[1]?.metadata.media;
      return `url('https://ipfs.fleek.co/ipfs/${hash}')`;
    },
  },
});
</script>

<style lang="scss">
  .avatar {
    width: 590px;
    &:last-child {
      text-align: right;
      .stats {
        justify-content: flex-end;
        &__points {
          left: auto;
          right: 20px;
        }
      }
    }
  }

  .curpo {
    cursor: pointer;
  }

  .name {
    line-height: 25px;
  }

  .stats {
    line-height: 25px;
    width: 100%;
    background-color: #CCCCCC;
    margin-bottom: 10px;
    display: flex;
    position: relative;
    &__points {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translate(0, -50%);
    }
    &__health {
      height: 32px;
      padding: 0 15px;
      transition: .5s;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: 140px 290px 140px;
    grid-gap: 10px;
    & > div {
      display: grid;
      grid-gap: 10px;
    }
    &__bottom {
      grid-column: 1 / 4;
      display: flex !important;
      justify-content: space-between;
      align-items: center;
    }
    &__center {
      background-color: #CCCCCC;
      position: relative;
      & > div {
        &:first-child {
          position: absolute;
          bottom: 70px;
          left: -10px;
        }
        &:last-child {
          position: absolute;
          bottom: 70px;
          right: -10px;
        }
      }
    }
  }
</style>