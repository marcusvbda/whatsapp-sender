<template>
  <div class="overlay-progress" v-if="sending">
    <div class="--dialog">
      <div class="--close-btn" v-if="show_result" @click="close_result">
        <i class="fas fa-times" />
      </div>
      <div class="--title">
        <template v-if="show_result"> FINALIZADO </template>
        <template v-else>
          {{ sending_state == "pause" ? "ENVIO PAUSADO" : "ENVIANDO" }}
        </template>
      </div>
      <template v-if="show_result"> RESULTADO </template>
      <template v-else>
        <div class="--row-btns">
          <div class="--progress-numbers">
            {{ current_number_index }}/{{ sending_numbers.length }}
          </div>
          <div class="--play-btns">
            <template v-if="sending_state == 'play'">
              <a href="#">
                <i class="fas fa-stop" />
              </a>
              <a href="#" @click.prevent="pause">
                <i class="fas fa-pause" />
              </a>
            </template>
            <template v-else>
              <a href="#" @click.prevent="play">
                <i class="fas fa-play" />
              </a>
            </template>
          </div>
        </div>
        <div class="--progressbar">
          <div
            class="--progressbar-progress"
            :style="{
              width: `${
                (current_number_index * 100) / sending_numbers.length
              }%`,
            }"
          />
        </div>
        <div class="--description">
          Você pode pausar e parar o envio quando quiser clicando nos botões de
          ação
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/runtime-core";
import "./styles.scss";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const sending = computed(() => store.getters["sender/getSending"]);
    const sending_numbers = computed(() => {
      return store.getters["sender/getSendingNumbers"];
    });
    const current_number_index = computed(() => {
      return store.getters["sender/getCurrentNumberIndex"];
    });
    const show_result = computed(() => store.getters["sender/getShowResult"]);
    const sending_state = computed(() => {
      return store.getters["sender/getSendingState"];
    });
    const close_result = () => store.dispatch("sender/closeResult");
    const set_sending_state = (val) => {
      store.commit("sender/setSendingState", val);
    };
    const pause = () => set_sending_state("pause");
    const play = () => {
      set_sending_state("play");
      store.dispatch("sender/sendCurrentNumberMessage");
    };

    return {
      sending,
      sending_numbers,
      current_number_index,
      show_result,
      sending_state,
      close_result,
      pause,
      play,
    };
  },
};
</script>
