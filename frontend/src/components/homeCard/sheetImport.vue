<template>
  <div>
    <div class="--input-file">
      <input
        class="form-input --numbers"
        placeholder="planilha_de_telefones.xls"
      />
      <button>Upload</button>
    </div>
    <textarea
      class="form-input --message"
      placeholder="Olá {nome}, está mensagem está sendo enviada via WhatsApp Sender ... "
      rows="6"
    />
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
