<script setup lang="ts">
import { IMessage } from '~~/utils/chat'

const messages = ref<IMessage[]>([])
// 添加user message
const addUserMessage = (content:string) => {
  messages.value.push({
    content,
    role: 'user'
  })
}
// 添加bot message
const addBotMessage = (content:string) => {
  messages.value.push({
    content,
    role: 'assistant'
  })
}

// 添加message
const addMessage = (message:IMessage) => {
  messages.value.push(message)
}
// message逐字添加
const addMessageByChar = () => {
  const message = messages.value[currentMessage.currentMsgIndex]
  if (message) {
    if (currentMessage.currentCharIndex < currentMessage.content.length) {
      message.content += currentMessage.content[currentMessage.currentCharIndex]
      currentMessage.currentCharIndex++
    }
  } else {
    addBotMessage(currentMessage.content[currentMessage.currentCharIndex])
    currentMessage.currentCharIndex++
  }
  if (!currentMessage.fisnished || currentMessage.currentCharIndex < currentMessage.content.length) {
    setTimeout(() => {
      addMessageByChar()
    }, 200)
  } else {
    currentMessage.currentCharIndex = 0
    currentMessage.fisnished = false
  }
}

const currentMessage = reactive({
  content: '',
  currentMsgIndex: 0,
  currentCharIndex: 0,
  fisnished: false
})
// 提交message
const submitMessage = async (content:string) => {
  btnLoading.value = true
  console.log('submitMessage', content)
  addUserMessage(content)
  const res = await $fetch('/api/chat/chatByStream', { method: 'POST', body: messages.value, responseType: 'stream' })
  const messageLength = messages.value.length
  currentMessage.content = ''
  currentMessage.fisnished = false
  const decoder = new TextDecoder('utf-8')
  const reader = res.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      input.value = ''
      btnLoading.value = false
      currentMessage.fisnished = true
      break
    }
    currentMessage.content += decoder.decode(value)
  }
}
watch(() => currentMessage.content, (newVal, oldVal) => {
  if (oldVal === '') {
    currentMessage.currentMsgIndex = messages.value.length
    currentMessage.fisnished = false
    addMessageByChar()
  } else {
    addMessageByChar()
  }
})
const input = ref('')
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
        v-model:value="input"
        class="border border-gray-400 rounded-full w-full"
        type="input"
        placeholder="输入消息"
        @keyup.enter="submitMessage(input)"
      />
      <!-- <n-button :loading="btnLoading" @click="submitMessage(input)">
        提交
      </n-button> -->
    </div>
  </div>
</template>
