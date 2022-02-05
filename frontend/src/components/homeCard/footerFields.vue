<template>
  <div>
    <textarea
      class="form-input --message"
      placeholder="Olá, está mensagem está sendo enviada via WhatsApp Sender ... "
      rows="6"
      v-model="message"
    />
    <label :class="`form-switch --checkbox ${useAttachment && 'checked'}`">
      <input type="checkbox" v-model="useAttachment" />
      Enviar anexo
    </label>
    <section class="--dropzone" v-if="useAttachment">
      Arraste seu arquivo para cá ou clique para fazer o upload ...
    </section>
    <div class="--submit-row">
      <div class="--submit-btn" @click.prevent="submit">
        Iniciar envio
        <i class="fas fa-arrow-right" />
      </div>
    </div>
    <div class="--obs-row">
      O envio das mensagens poderá ser pausado ou paralisado a qualquer momento.
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  name: "footerFields",
  setup() {
    const store = useStore();
    const useAttachment = computed({
      get: () => store.getters["sender/getUseAttachment"],
      set: (val) => store.commit("sender/setUseAttachment", val),
    });
    const numbers = computed(() => store.getters["sender/getNumbers"]);
    const message = computed({
      get: () => store.getters["sender/getMessage"],
      set: (val) => store.commit("sender/setMessage", val),
    });
    const submit = () => store.dispatch("sender/submit");

    return {
      useAttachment,
      numbers,
      submit,
      message,
    };
  },
};
</script>
