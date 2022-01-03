<template>
  <LoadingSection v-if="currentAction == 'loading'" />
  <div v-else>
    <GradientTopbar />
    <section class="relative top-140neg">
      <QrCodeCard v-if="currentAction == 'qrcode'" />
      <template v-if="currentAction == 'home'">
        <h1>Is Logged</h1>
      </template>
    </section>
  </div>
</template>
<script>
import GradientTopbar from "@/components/gradientTopbar";
import QrCodeCard from "@/components/qrCodeCard";
import LoadingSection from "@/components/LoadingSection";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "HomeContent",
  components: {
    GradientTopbar,
    QrCodeCard,
    LoadingSection,
  },
  setup() {
    const store = useStore();
    store.dispatch("application/initSocket");

    const currentAction = computed(
      () => store.getters["application/getCurrentAction"]
    );

    return { currentAction: computed(() => currentAction.value) };
  },
};
</script>
