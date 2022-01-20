<template>
  <LoadingSection v-if="currentAction == 'loading'" />
  <div v-else>
    <GradientTopbar />
    <section class="relative top-140neg">
      <QrCodeCard v-if="currentAction == 'qrcode'" />
      <HomeCard  v-if="currentAction == 'home'"/>
    </section>
  </div>
</template>
<script>
import GradientTopbar from "@/components/gradientTopbar";
import QrCodeCard from "@/components/qrCodeCard";
import HomeCard from "@/components/homeCard";
import LoadingSection from "@/components/loadingSection";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "HomeContent",
  components: {
    GradientTopbar,
    QrCodeCard,
    LoadingSection,
    HomeCard
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
