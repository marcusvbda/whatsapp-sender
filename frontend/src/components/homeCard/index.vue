<template>
  <div>
    <ContentCard class="home-card">
      <template v-slot:body>
        <div class="--content">
          <h3 class="--title">Envio de mensagem</h3>
          <TabsContainer
            :tabs="['Definição manual', 'Importação de planilha']"
            v-model="tab"
          >
            <template v-slot:tab-0>
              <ManualDefinition />
            </template>
            <template v-slot:tab-1>
              <SheetImport />
            </template>
          </TabsContainer>
          <FooterFields />
        </div>
      </template>
    </ContentCard>
    <ProgressOverlay />
  </div>
</template>
<script>
import ContentCard from "@/components/contentCard";
import TabsContainer from "@/components/tabsContainer";
import ManualDefinition from "@/components/homeCard/manualDefinition";
import SheetImport from "@/components/homeCard/sheetImport";
import ProgressOverlay from "@/components/progressOverlay";
import FooterFields from "@/components/homeCard/footerFields";
import "./styles.scss";
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed } from "@vue/runtime-core";

export default {
  name: "QrCodeCard",
  components: {
    ContentCard,
    TabsContainer,
    ManualDefinition,
    SheetImport,
    ProgressOverlay,
    FooterFields,
  },
  setup() {
    const store = useStore();
    const action = ref("start");
    const tab = computed({
      get: () => store.getters["sender/getTab"],
      set: (val) => store.commit("sender/setTab", val),
    });

    return {
      action,
      tab,
    };
  },
};
</script>
