<template>
  <GradientTopbar />
  <section class="relative top-140neg">
    <QrCodeCard v-if="showQrCodeComponent" />
  </section>
</template>
<script>
import GradientTopbar from "@/components/gradientTopbar";
import QrCodeCard from "@/components/qrCodeCard";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";

export default {
  name: "HomeContent",
  components: {
    GradientTopbar,
    QrCodeCard,
  },
  setup() {
    const store = useStore();

    const currentAction = computed(
      () => store.getters["application/getCurrentAction"]
    );
    const showQrCodeComponent = computed(() => currentAction.value == "qrcode");

    const testApiConnection = () => {
      return store.dispatch("application/testApiConnection");
    };

    return { showQrCodeComponent, testApiConnection };
  },
  created() {
    this.testApiConnection().then((res) => {
      console.log(res);
    });
  },
};
</script>
