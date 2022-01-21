<template>
  <div>
    <input
      class="form-input --numbers"
      placeholder="Números separados por virgula"
    />
    <textarea
      class="form-input --message"
      placeholder="Olá {nome}, está mensagem está sendo enviada via WhatsApp Sender ... "
      rows="6"
    />
  </div>
</template>
<script>
export default {
  name: "manualDefinition",
};
</script>
