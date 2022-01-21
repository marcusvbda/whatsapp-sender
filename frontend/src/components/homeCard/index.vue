<template>
  <div>
    <ContentCard class="home-card">
      <template v-slot:body>
        <div class="--content">
          <h3 class="--title">Envio de mensagem</h3>
          <TabsContainer :tabs="['Definição manual', 'Importação de planilha']">
            <template v-slot:tab-0>
              <ManualDefinition />
            </template>
            <template v-slot:tab-1>
              <SheetImport />
            </template>
          </TabsContainer>
          <label :class="`form-switch --checkbox ${attachment && 'checked'}`">
            <input type="checkbox" v-model="attachment" />
            Enviar anexo
          </label>
          <section class="--dropzone" v-if="attachment">
            Arraste seu arquivo para cá ou clique para fazer o upload ...
          </section>
          <div class="--submit-row">
            <div class="--submit-btn">
              Iniciar envio
              <i class="fas fa-arrow-right" />
            </div>
          </div>
          <div class="--obs-row">
            O envio das mensagens poderá ser pausado ou paralisado a qualquer
            momento.
          </div>
        </div>
      </template>
    </ContentCard>
    <ProgressOverlay v-if="sending" :total="100" :current="51" />
  </div>
</template>
<script>
import ContentCard from "@/components/contentCard";
import TabsContainer from "@/components/tabsContainer";
import ManualDefinition from "@/components/homeCard/manualDefinition";
import SheetImport from "@/components/homeCard/sheetImport";
import ProgressOverlay from "@/components/progressOverlay";
import "./styles.scss";
import { ref } from "@vue/reactivity";

export default {
  name: "QrCodeCard",
  components: {
    ContentCard,
    TabsContainer,
    ManualDefinition,
    SheetImport,
    ProgressOverlay,
  },
  setup() {
    const action = ref("start");
    const attachment = ref(false);
    const sending = ref(false);
    return {
      action,
      attachment,
      sending,
    };
  },
};
</script>
