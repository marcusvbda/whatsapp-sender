<template>
  <ContentCard class="home-card">
    <template v-slot:body> Conteúdo aqui ... </template>
  </ContentCard>
</template>
<script>
import ContentCard from "@/components/contentCard";
import "./styles.scss";

export default {
  name: "QrCodeCard",
  components: {
    ContentCard,
  },
};
</script>
