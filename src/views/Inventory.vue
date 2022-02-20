<template>
  <div class="inventory">
    <div class="inventory__container">
      <div class="inventory__avatar">
        <Avatar
          :warrior="warrior"
          :equipment="equipment"
          :unEquip="unEquip"
        />
        <div class="inventory__stats">
          <div
            v-for="(value, name) in warrior"
            :key="name"
          >
            <div
              v-if="name !== 'account_id' && name.toLowerCase() != 'defence'"
              class="inventory__stat"
            >
              <span>{{name}}</span>: <p>{{value}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="equip">
        <h1>Inventory</h1>
        <div class="nfts">
          <div
            class="nft"
            v-for="(nft, index) in nfts" :key="index"
            :class="{nftDisabled: isEquiped(nft.token_id)}"
            @click="!isEquiped(nft[0]) && changeEquipment(parsedExtra(nft.token_id).type, nft.token_id)"
          >
            <img :src="`https://ipfs.fleek.co/ipfs/${nft.metadata.media}`" alt="">
            <!-- {{parsedExtra(nft[1]?.metadata?.extra)?.type}} -->
          </div>
        </div>
        <action-button
          v-if="!changedEquip"
          :action="!changeProgress && setEquipment"
          view="action"
          :text="changeProgress ? 'Pending...' : 'Set equipment'"
          :active="!changeProgress"
        />
      </div>
    </div>
  </div>
</template>

<script lang=ts>
import { defineComponent } from 'vue';
import store from '@/store';
import axios from 'axios';
import ActionButton from '@/components/buttons/ActionButton.vue';
import Avatar from '@/components/Avatar.vue';

export default defineComponent({
  data() {
    return {
      nfts: [],
      warrior: {
        account_id: '',
        strength: 1,
        stamina: 1,
        agility: 1,
        intuition: 1,
        health: 10,
        defence: 1
      },
      equipment: {
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
      },
      changeProgress: false,
    }
  },
  components: {
    Avatar,
    ActionButton,
  },
  async mounted() {
    await this.getCollectibilities();
  },
  computed: {
    walletConnection() {
      return store.state.walletConnection;
    },
    contract() {
      return store.state.contract;
    },
    parasContract() {
      return store.state.parasContract;
    },
    changedEquip(): boolean {
      return JSON.stringify(this.equipment) === JSON.stringify(this.baseEquipment);
    },
    baseEquipment(): Record<string, any> {
      return store.state.baseEquipment;
    },
    tokenSeries(): any[] {
      return store.state.tokenSeries;
    },
  },
  methods: {
    unEquip(slot: string) {
      const newEquip = {
        ...this.equipment,
        [slot]: null,
      };
      this.equipment = newEquip;
    },
    isEquiped(token_series_id: any) {
      return Object.values(this.equipment).some((s: any) => s === token_series_id);
    },
    countStats() {
      const newWarriorObj: any = {
        strength: 1,
        stamina: 1,
        agility: 1,
        intuition: 1,
        health: 10,
        defenсe: 1,
        account_id: this.walletConnection?._authData?.accountId,
      };

      Object.values(this.equipment).forEach((item: any) => {
        if (item !== null) {
          const token_series_id = item?.split(':')[0];
          const token: any = this.tokenSeries.find((s: any) => s[0] === token_series_id);
          if (token) {
            const extra = token[1]?.metadata?.extra;
            const parsedExtra = this.parsedExtra(token_series_id);
            Object.keys(parsedExtra).forEach((key: any) => {
              if (key !== 'type') {
                newWarriorObj[key.toLowerCase()] = parseInt(newWarriorObj[key.toLowerCase()]) + parseInt(parsedExtra[key.toLowerCase()]);
              }
            });
          }
        }
      });
      newWarriorObj.health = newWarriorObj.stamina * 10;
      this.warrior = newWarriorObj;
    },
    parsedExtra(token_id: string) {
      const token = this.tokenSeries.find((s: any) => s[0] === token_id.split(':')[0]);
      const obj: any = {};
      const arr = token[1].metadata.extra.split(',');
      arr.forEach((a: any) => {
        const prop = a.split(':');
        obj[prop[0]] = prop[1];
      });

      return obj;
    },
    async getCollectibilities() {
      // const nfts = await axios.get('https://api-v2-testnet-master.paras.id/token', {
      //   params: {
      //     owner_id: this.walletConnection?._authData?.accountId,
      //     __skip: 0,
      //     limit: 100,
      //   }
      // });
      const nfts = await this.parasContract.nft_tokens_for_owner({
        account_id: this.walletConnection?._authData?.accountId,
      });

      if (nfts) {
        const tokenSeries = await this.contract.get_token_series({
          from_index: 0,
          limit: 200,
        });
        this.nfts = nfts.filter(((re: any) => tokenSeries.find((s: any) => s[0] === re.token_id.split(':')[0])));
        this.getEquipment();
      }
    },
    async getEquipment() {
      const equip = await this.contract.get_warrior_equipment({account_id: this.walletConnection?._authData?.accountId});
      store.commit('setBaseEquipment', equip);
      this.equipment = equip;
      this.countStats();
    },
    async changeEquipment(type: string, token_series_id: string) {
      const eqObj: any = {
        ...this.equipment,
      };
      if (type !== 'weapon') {
        eqObj[type] = token_series_id;
      } else {
        if (eqObj.weapon_1 === null) {
          eqObj.weapon_1 = token_series_id;
        } else if (eqObj.weapon_2 === null) {
          eqObj.weapon_2 = token_series_id;
        } else {
          eqObj.weapon_1 = token_series_id;
        }
      }
      this.equipment = eqObj;
    },
    async setEquipment() {
      this.changeProgress = true;
      await this.contract.change_warrior_equipment({equipment: this.equipment});
      await this.getEquipment();
      this.changeProgress = false;
    }
  },
});
</script>

<style lang="scss">
  .inventory {
    padding: 20px;
    &__container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    &__stats {
      margin-top: 20px;
    }
    &__stat {
      display: flex;
      margin-top: 5px;
      & > p {
        font-weight: bold;
        margin-left: 5px;
      }
      & > span {
        text-transform: capitalize;
      }
    }
  }
  .equip {
    padding-top: 20px;
    flex: 1;
    margin-left: 100px;
  }
  .nfts {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  .nft {
    margin-right: 10px;
    cursor: pointer;
    & > img {
      max-width: 100px;
    }
    &Disabled {
      opacity: .5;
      cursor: default;
    }
  }
</style>