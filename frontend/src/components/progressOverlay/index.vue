<template>
  <div class="overlay-progress">
    <div class="--dialog">
      <div class="--close-btn">
        <i class="fas fa-times" />
      </div>
      <div class="--title">ENVIANDO</div>
      <div class="--row-btns">
        <div class="--progress-numbers">{{ current }}/{{ total }}</div>
        <div class="--play-btns">
          <i class="fas fa-stop" />
          <i class="fas fa-pause" />
        </div>
      </div>
      <div class="--progressbar">
        <div
          class="--progressbar-progress"
          :style="{ width: `${(current * 100) / total}%` }"
        />
      </div>
      <div class="--description">Para editar a mensagem pause o envio</div>
    </div>
  </div>
</template>
<script>
import "./styles.scss";

export default {
  props: {
    total: {
      type: Number,
      default: 100,
    },
    current: {
      type: Number,
      default: 0,
    },
  },
};
</script>
