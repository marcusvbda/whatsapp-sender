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
import { watch } from "@vue/runtime-core";

export default {
  name: "tabsContainer",
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const action = reactive("start");
    const tab = ref(props.value);
    watch(tab, (val) => {
      emit("update:modelValue", val);
    });

    return {
      action,
      tab,
    };
  },
};
</script>
