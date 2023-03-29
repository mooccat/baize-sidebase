<script setup lang="ts">
const { data: chat } = useFetch('/api/chat/chat', { method: 'POST', body: JSON.stringify({ text: 'client' }) })
</script>

<template>
  <div>
    Prisma ORM Data from the database, received {{ chat?.length || 0 }} records: <pre>{{ chat }}</pre>
  </div>
</template>
