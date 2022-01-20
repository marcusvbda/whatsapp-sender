<template>
  <section class="content-card">
    <div class="container py-7">
      <div class="--card">
        <div class="--body" v-if="$slots['body']">
          <slot name="body" />
        </div>
        <div class="--footer" v-if="$slots['footer']">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import "./styles.scss";

export default {
  name: "ContentCard",
};
</script>
