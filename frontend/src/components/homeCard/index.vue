<template>
  <ContentCard class="home-card">
    <template v-slot:body>
      <div class="--content">
        <h3 class="--title">Envio de mensagem</h3>
        <TabsContainer :tabs="['Definição Manual', 'Importação de planilha']">
          <template v-slot:tab-0> Definição aqui </template>
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
import { reactive } from "@vue/reactivity";

export default {
  name: "QrCodeCard",
  components: {
    ContentCard,
    TabsContainer,
  },
  setup() {
    const action = reactive("start");
    return {
      action,
    };
  },
};
</script>
