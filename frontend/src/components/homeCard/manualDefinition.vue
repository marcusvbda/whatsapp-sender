<template>
  <div>
    <input
      class="form-input --numbers"
      placeholder="Números separados por virgula"
      v-model="numbers"
    />
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";
export default {
  name: "manualDefinition",
  setup() {
    const store = useStore();
    const numbers = computed({
      get: () => store.getters["sender/getNumbers"],
      set: (value) => store.commit("sender/setNumbers", value),
    });
    return {
      numbers,
    };
  },
};
</script>
