<template>
  <ContentCard class="home-card">
    <template v-slot:body>
      <div class="--content">
        <h3 class="--title">Envio de mensagem</h3>
        <TabsContainer :tabs="['Definição Manual', 'Importação de planilha']">
          <template v-slot:tab-0>
            <input
              class="form-input --numbers"
              placeholder="Números separados por virgula"
            />
            <textarea
              class="form-input --message"
              placeholder="Olá {nome}, está mensagem está sendo enviada via WhatsApp Sender ... "
              rows="6"
            />
            <label :class="`form-switch --checkbox ${attachment && 'checked'}`">
              <input type="checkbox" v-model="attachment" />
              Enviar anexo
            </label>
          </template>
          <template v-slot:tab-1> importação aqui </template>
        </TabsContainer>
      </div>
    </template>
  </ContentCard>
</template>
<script>
import ContentCard from "@/components/contentCard";
import TabsContainer from "@/components/tabsContainer";
import "./styles.scss";
import { ref } from "@vue/reactivity";

export default {
  name: "QrCodeCard",
  components: {
    ContentCard,
    TabsContainer,
  },
  setup() {
    const action = ref("start");
    const attachment = ref(false);
    return {
      action,
      attachment,
    };
  },
};
</script>
