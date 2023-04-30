// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['nuxt-electron', '@nuxtjs/tailwindcss'],
    electron: {
        include: ['electron'],
        outDir: 'dist-electron'
    },
	css: ['@/assets/css/main.css'],

});
