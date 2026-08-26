<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const colorMode = ref('light')

onMounted(() => {
  const saved = localStorage.getItem('pharasma-color-mode')
  if (saved) {
    colorMode.value = saved
  } else {
    colorMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  updateHtmlClass()
})

function toggleColorMode() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('pharasma-color-mode', colorMode.value)
  updateHtmlClass()
}

function updateHtmlClass() {
  if (colorMode.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex flex-col transition-colors duration-300">
      <header class="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-900/75 backdrop-blur">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center gap-8">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30 overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-6 h-6 text-white">
                    <path 
                      d="M 50,5 
                         C 25,5 5,25 5,50 
                         C 5,75 25,95 50,95 
                         C 75,95 95,75 95,50 
                         C 95,25 75,15 50,15 
                         C 30,15 15,30 15,50 
                         C 15,70 30,85 50,85 
                         C 70,85 85,70 85,50 
                         C 85,30 70,25 50,25 
                         C 35,25 25,35 25,50 
                         C 25,65 35,75 50,75 
                         L 50,74 
                         C 37,74 27,66 27,50 
                         C 27,37 37,27 50,27 
                         C 68,27 83,40 83,50 
                         C 83,68 68,83 50,83 
                         C 32,83 17,68 17,50 
                         C 17,32 32,17 50,17 
                         C 73,17 93,30 93,50 
                         C 93,73 73,93 50,93 
                         C 27,93 7,73 7,50 
                         C 7,27 27,7 50,15 
                         Z" 
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">Pharasma's Queue</span>
              </div>
              <nav class="hidden md:flex items-center gap-1">
                <UButton to="/tracker" variant="ghost" color="neutral">Tracker</UButton>
              </nav>
            </div>
            <div class="flex items-center gap-2">
              <UButton
                :icon="colorMode === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
                color="neutral"
                variant="ghost"
                @click="toggleColorMode"
                aria-label="Toggle color mode"
              />
              <UButton
                icon="i-simple-icons-github"
                color="neutral"
                variant="ghost"
                to="https://github.com"
                target="_blank"
                aria-label="GitHub"
              />
            </div>
          </div>
        </div>
      </header>

      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RouterView />
        </div>
      </main>

      <footer class="border-t border-neutral-200 dark:border-neutral-800 py-12 bg-neutral-50 dark:bg-neutral-900 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-sm text-neutral-500">
            &copy; 2026 Pharasma's Queue. Built with Nuxt UI & Tailwind CSS 4.
          </p>
        </div>
      </footer>
    </div>
  </UApp>
</template>
