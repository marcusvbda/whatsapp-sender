<template>
  <section class="qrcode-card">
    <div class="container py-7">
      <div class="--card">
        <div class="--body">
          <div class="--left">
            <div class="container">
              <h1 class="--title">Para iniciar sessão no serviço :</h1>
              <div class="--option-list">
                <div class="--item">1. Abra o WhatsApp em seu celular.</div>
                <div class="--item">
                  2. Clique em <b>Menu</b> ou <b>Configurações</b> e selecione
                  <b>Aparelhos conectados</b>
                </div>
                <div class="--item">
                  3. Caso não esteja habilitado, habilite a opção de
                  <b>Múltiplos aparelhos</b>
                </div>
                <div class="--item">
                  4. Clique em <b>Conectar um aparelho</b>, aponte o a seu
                  celular para o <b>QR Code</b> ao lado e aguarde a conexão
                </div>
              </div>
            </div>
          </div>
          <div class="--right">
            <div class="container h-full">
              <div class="--qrcode-skeleton" v-if="qrCodeIsLoading" />
              <img v-else :src="qrCodeImage" />
            </div>
          </div>
        </div>
        <div class="--footer">
          Está será a conexão que o sistema utilizará para efetuar os disparos
          de mensagens, tanto manuais (em massa ou não) quanto automáticos
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import "./styles.scss";

export default {
  name: "QrCodeCard",
  setup() {
    const store = useStore();
    return {
      qrCodeIsLoading: computed(
        () => store.getters["application/getQrCodeIsLoading"]
      ),
      qrCodeImage: computed(() => store.getters["application/getQrCodeImage"]),
      isLogged: computed(() => store.getters["application/getIsLogged"]),
    };
  },
};
</script>
