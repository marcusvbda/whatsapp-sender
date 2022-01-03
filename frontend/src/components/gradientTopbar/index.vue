<template>
  <section class="gradient-topbar">
    <div class="container py-7">
      <template v-if="type == 'default'">
        <div class="--log-section">
          <div class="logo" />
          WhatsApp Sender
        </div>
      </template>
    </div>
  </section>
</template>
<script>
import "./styles.scss";
export default {
  name: "GradientTopbar",
  props: {
    type: {
      type: String,
      default: "default",
    },
  },
};
</script>
