<template>
  <section class="loading-section">
    <div class="container">
      <div class="logo" />
      <ProgressBar class="loading--progress" />
      <div class="loading--title">WhatsApp Sender</div>
      <div class="loading--subtitle">
        <div class="locked-icon" />
        Verificando a autenticidade da sessão selecionada
      </div>
    </div>
  </section>
</template>
<script>
import "./styles.scss";
import ProgressBar from "@/components/progressBar";
export default {
  name: "LoadingSection",
  components: {
    ProgressBar,
  },
};
</script>
