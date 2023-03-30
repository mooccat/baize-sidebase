<script setup lang="ts">
import { IMessage } from '~~/utils/chat'

const messages:IMessage[] = ref([])
// 添加user message
const addUserMessage = (content:string) => {
  console.log('addUserMessage', content)
  messages.value.push({
    content,
    role: 'user'
  })
}
// 添加bot message
const addBotMessage = (content:string) => {
  console.log('addBotMessage', content)
  messages.value.push({
    content,
    role: 'assistant'
  })
}
// 添加message
const addMessage = (message:IMessage) => {
  messages.value.push(message)
}

// 提交message
const submitMessage = async (content:string) => {
  btnLoading.value = true
  console.log('submitMessage', content)
  addUserMessage(content)
  const res = await useFetch('/api/chat/chat', { method: 'POST', body: messages.value })
  console.log('res', res.data.value)
  addMessage(res.data.value.data)
  value.value = ''
  btnLoading.value = false
}
const value = ref('')
const btnLoading = ref(false)
</script>

<template>
  <div class="flex flex-col h-screen p-2">
    <div v-for="message in messages" :key="message.content">
      <div v-if="message.role==='user'" class="flex justify-start mb-4">
        <div class="bg-gray-200 text-gray-800 rounded-lg px-4 py-2 max-w-lg">
          <p class="text-sm">
            {{ message.content }}
          </p>
        </div>
      </div>
      <div v-if="message.role === 'assistant'" class="flex justify-end mb-4">
        <div class="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-lg">
          <p class="text-sm">
            {{ message.content }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="flex justify-center p-4 fixed bottom-0 w-full"
    >
      <n-input
        v-model:value="
          value"
        class="border border-gray-400 rounded-full w-full"
        type="input"
        placeholder="输入消息"
      />
      <n-button :loading="btnLoading" @click="submitMessage(value)">
        提交
      </n-button>
    </div>
  </div>
</template>
