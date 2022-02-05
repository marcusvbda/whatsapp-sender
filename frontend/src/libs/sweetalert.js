import { VueApp } from "@/main";

export const sweetalert = {
  async alert(icon, title, text) {
    return VueApp.$swal.fire({ icon, title, text });
  },
  async toast(title, icon = "success", position = "top-end") {
    return VueApp.$swal.fire({
      position,
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  },
  async confirm(
    title,
    text,
    icon = "warning",
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar"
  ) {
    return VueApp.$swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    });
  },
};
