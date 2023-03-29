<script setup lang="ts">
const { $client } = useNuxtApp()

const hello = await $client.hello.useQuery({ text: 'client' })
const hello1 = await $client.example.useQuery()
// const text = await $client.example.useQuery();
</script>

<template>
  <div>
    <!-- As `superjson` is already pre-configured, we can use `time` as a `Date` object without further deserialization 🎉 -->
    tRPC Data: "{{ hello.data.value?.greeting }}" send at "{{
      hello.data.value?.time.toLocaleDateString("en-EN")
    }}".
    {{ hello1.data.value?.greeting }}
  </div>
</template>
