<script setup>
import {decodeCredential, GoogleLogin} from 'vue3-google-login'
import router from "@/router.js";
const callback = async (response) => {
  // decodeCredential will retrieve the JWT payload from the credential
  localStorage.setItem("Token", response.credential)
  const userData = decodeCredential(response.credential)
  localStorage.setItem("UserData", JSON.stringify(userData))
  await router.push({path: "/", replace: true})
  window.location.reload()

}
</script>

<template>
  <GoogleLogin :callback="callback" prompt auto-login/>
</template>
