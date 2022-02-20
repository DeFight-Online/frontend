<template>
  <div>
    <div class="battle" v-if="battleState.winner === null && currentTime > 0">
      <div class="battle__container">
        <div class="battle__fight">
          <Avatar
            :warrior="battleState.warrior_1"
            :equipment="baseEquipment"
          />
          <div class="actions">
            <War
              :double="false"
              @move="setAction"
              type="Attack"
              :turn="activeTurn"
            />
            <div
              class="timer"
              v-if="battleState.last_action_timestamp"
            >
              <span v-if="actionInProgress">...</span>
              <span v-else>00:<span v-if="currentTime < 10">0</span>{{currentTime}}</span>
            </div>
            <War
              @move="setAction"
              :double="false"
              type="Protect"
              :turn="activeTurn"
            />

            <action-button
              :action="!actionInProgress && setMove"
              :active="!actionInProgress"
              :view="!actionInProgress && 'action'"
              :text="actionInProgress ? 'Waiting...' : 'Go'"
            />

            <p v-if="moveError" class="battle__forgot">Your forgot to choose something...</p>

          </div>
          <Avatar
            :warrior="battleState.warrior_2"
            :equipment="battleState.warrior_2.account_id.includes('(bot)') && baseEquipment"
          />
        </div>
      </div>
    </div>
    <div
      class="battle__status continue"
      v-if="currentTime <= 0 && battleState.winner === null && !generalLoader"
    >
      <action-button
        :action="!actionInProgress ? () => setMove('Attack:Legs Protect:Legs') : null"
        :active="!actionInProgress"
        :view="!actionInProgress && 'action'"
        :text="actionInProgress ? 'Loading...' : 'Continue the battle'"
      />
    </div>
    <div class="battle" v-if="battleState.winner === 0 && !lookingForBattle">
      <div class="battle__status">
        <span class="draw">DRAW</span>
      </div>
    </div>
    <div class="battle" v-if="battleState.winner === 1 && !lookingForBattle">
      <div class="battle__status">
        <span class="win">YOU WIN</span>
      </div>
    </div>
    <div class="battle" v-if="battleState.winner === 2 && !lookingForBattle">
      <div class="battle__status">
        <span class="lose">YOU LOSE</span>
      </div>
    </div>
    <h1 v-if="battleState.winner !== null && !generalLoader" class="defight">DEFIGHT.online</h1>
    <action-button
      class="battle__start"
      v-if="battleState.winner !== null && !generalLoader"
      :action="!lookingForBattle ? walletConnection?._authData?.accountId && startBattle : null"
      :active="!lookingForBattle"
      :view="!lookingForBattle && 'action'"
      :text="lookingForBattle ? 'Looking for a battle...' : 'Start new Battle'"
    />
    <Logs v-if="battleState.winner === null && currentTime > 0" :logs="logs"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Avatar from '@/components/Avatar.vue';
import War from '@/components/War.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import Logs from '@/components/logs/Logs.vue';

import { Near } from 'near-api-js';
import getConfig from '../config/nearConfig';
import store from "@/store"

export default defineComponent({
  name: 'Battle',
  data() {
    return {
      near: {} as Near,
      nearConfig: getConfig('testnet'),
      actions: {},
      battleId: 0,
      battleState: {} as any,
      currentTime: 0,
      timer: null as any,
      activeTurn: false,
      lookingForBattle: false,
      actionInProgress: false,
      generalLoader: false,
      logs: [],
      moveError: false,
    }
  },
  components: {
    Avatar,
    War,
    Logs,
    ActionButton,
  },
  mounted() {
    this.generalLoader = true;
    setTimeout(async () => {
      const lastBattleId: string | null = localStorage.getItem('lastBattleId');
      if (lastBattleId) {
        await this.getBattle(parseInt(lastBattleId));
      }
      this.generalLoader = false;
    }, 1000);
  },
  watch: {
    currentTime(time) {
      if (time < 0) {
        this.stopTimer();
      }
    },
  },
  computed: {
    baseEquipment () {
      return store.state.baseEquipment;
    },
    contract() {
      return store.state.contract;
    },
    walletConnection () {
      return store.state.walletConnection;
    },
  },
  methods: {
    writeTurns(turn: Record<string, string>) {
      const turnsArray = localStorage.getItem('turns');
      if (turnsArray) {
        const parsedArray = JSON.parse(turnsArray);
        if (parsedArray[0]?.last_action_timestamp !== turn.last_action_timestamp) {
          parsedArray.unshift(turn);
          this.logs = parsedArray;
          localStorage.setItem('turns', JSON.stringify(parsedArray));
        }
      }
    },
    actionTimer() {
      this.timer = setInterval(() => {
        const startPoint = Math.trunc(this.battleState?.last_action_timestamp / 1000000) + 60000;
        const currentPoint = Date.now();
        const currentTime = Math.trunc((startPoint - currentPoint) / 1000);
        this.currentTime = currentTime < 0 ? 0 : currentTime;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    setAction(action: Record<string, string>) {
      this.actions = {
        ...this.actions,
        ...action,
      };
    },
    async startBattle() {
      this.lookingForBattle = true;
      const battleID = await this.contract.start_battle({}, 300000000000000);
      localStorage.setItem('turns', '[]');
      localStorage.setItem('lastBattleId', battleID);
      this.actions = {};
      this.getBattle(battleID);
    },
    async getBattle(battle_id: number) {
      this.battleId = battle_id;
      const battle = await this.contract.get_battle({battle_id});
      const moves = {
        you: !battle.warrior_1_missed_action && battle.warrior_1_last_attack ? `Attack: ${battle.warrior_1_last_attack}, Protection: ${battle.warrior_1_last_protect}` : 'Skip the turn',
        opponent: !battle.warrior_2_missed_action && battle.warrior_2_last_attack ? `Attack: ${battle.warrior_2_last_attack}, Protection: ${battle.warrior_2_last_protect}` : 'Skip the turn',
        last_action_timestamp: battle.last_action_timestamp,
      };
      this.writeTurns(moves);
      this.battleState = battle;
      this.activeTurn = true;
      this.actionTimer();
      this.lookingForBattle = false;
    },
    async setMove(action?: string) {
      const actionString = action ? action : JSON.stringify(this.actions).replace(/\{|\}|"/ig, '').split(',').join(' ');
      const moveObj = {
        battle_id: this.battleId,
        params: action || actionString,
      };
      if (actionString.includes('Attack') && actionString.includes('Protect')) {
        this.actionInProgress = true;
        const move = await this.contract.make_action(moveObj);
        this.activeTurn = false;
        await this.getBattle(this.battleId);
        this.actionInProgress = false;
        this.actions = {};
      } else {
        this.moveError = true;
        setTimeout(() => {
          this.moveError = false;
        }, 1500);
      }
    },
  },
});
</script>

<style lang="scss">
  .battle {
    &__container {
      padding: 0 20px;
    }
    &__fight {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    &__forgot {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
    }
    &__status {
      position: absolute;
      top: 50%;
      left: 50%;
      font-weight: bold;
      font-size: 45px;
      transform: translate(-50%, -50%);
      .draw {
        color: gray;
      }
      .win {
        color: seagreen;
      }
      .lose {
        color: crimson;
      }
    }
    &__start {
      position: absolute;
      top: calc(50% + 60px);
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .defight {
    position: absolute;
    top: 20%;
    left: 50%;
    font-size: 150px;
    transform: translate(-50%, 0);
    color: #01BAEF;
  }

  .continue {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .actions {
    display: grid;
    grid-gap: 10px;
  }

  .timer {
    margin: 20px 0;
    text-align: center;
    font-size: 40px;
    span {
      line-height: 50px;
    }
    &__status {
      font-size: 14px;
    }
  }
</style>
