<template>
  <div class="tabs">
    <div class="--row-tabs">
      <button
        v-for="key in Object.keys(tabs)"
        :class="`--tab-btn ${tab == key && 'active'}`"
        @click="tab = key"
        :key="`btn-${key}`"
      >
        {{ tabs[key] }}
      </button>
    </div>
    <template v-for="key in Object.keys(tabs)">
      <slot :name="`tab-${key}`" v-if="tab == key" :key="`content-${key}`" />
    </template>
  </div>
</template>
<script>
import "./styles.scss";
import { reactive, ref } from "@vue/reactivity";

export default {
  name: "tabsContainer",
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    current_tab: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const action = reactive("start");
    const tab = ref(props.current_tab);
    return {
      action,
      tab,
    };
  },
  created() {
    console.log(this.$slots);
  },
};
</script>
