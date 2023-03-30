<script setup lang="ts">
const { data: categories } = useFetch('/api/category/templates')
</script>

<template>
  <div class="p-3">
    <div v-for="category in categories" :key="category.id">
      <div class="text-lg font-semibold text-black mb-2">
        {{ category.name }}
      </div>

      <div class="flex">
        <NuxtLink v-for="template in category.templates" :key="template.id" :to="{path:`/template/${template.key}`}" class="rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10">
          <div class="flex flex-col p-4">
            <div class="flex items-center gap-2">
              <span class="text-lg font-semibold text-black">{{ template.name }}</span>
            </div><span class="mt-4 text-sm text-gray-500">{{ template.description }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
