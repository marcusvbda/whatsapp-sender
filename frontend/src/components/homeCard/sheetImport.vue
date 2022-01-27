<template>
  <div>
    <div class="--input-file">
      <input class="form-input --numbers" type="file" />
    </div>
  </div>
</template>
<script>
import { ref } from "@vue/reactivity";

export default {
  name: "sheetImport",
  setup() {
    const attachment = ref(false);
    return {
      attachment,
    };
  },
};
</script>
