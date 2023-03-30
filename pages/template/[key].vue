<script setup lang="ts">
const route = useRoute()
const key = route.params.key as string
const { data: template } = useFetch(`/api/template/${key}`)
const input = ref('')
const loading = ref(false)
const resData = ref('')
const submit = async () => {
  loading.value = true
  const { data } = await useFetch('/api/chat/request', {
    method: 'POST',
    body: JSON.stringify({
      templateKey: key,
      input: input.value
    })
  })
  resData.value = data.value.data.content
  loading.value = false
}
const notification = useNotification()

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  notification.success({
    title: '复制成功',
    message: '已复制到剪贴板'
  })
}

</script>

<template>
  <div
    class="mx-auto flex w-11/12 max-w-[600px] flex-col gap-y-2 py-4 sm:w-4/5"
  >
    <a
      class="w-24"
      href="/"
    ><div
      class="flex w-24 flex-row items-center rounded-lg bg-gray-200 py-2 pl-2 text-sm"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </svg>
      <div class="-ml-[4px]">返回列表</div>
    </div></a>
    <h2 class="mt-4 text-xl font-semibold">
      {{ template.name }}
    </h2>
    <span class="text-sm text-gray-500">{{ template.description }}</span>
    <div
      class="mt-5 flex flex-col gap-y-2 rounded-xl bg-white p-4 ring-1 ring-slate-900/10"
    >
      <div class="flex w-full flex-col gap-y-4">
        <n-input
          v-model:value="input"
          type="textarea"
          class="w-full resize-none appearance-none rounded-lg p-2 ring-1 ring-slate-900/10 focus:ring-2 focus:ring-black"
          placeholder="输入内容"
        />
        <n-button type="primary" :loading="loading" @click="submit">
          提交
        </n-button>
      </div>
      <div v-if="resData" class="flex w-full flex-col gap-y-4">
        <n-input
          v-model:value="resData"
          type="textarea"
          :autosize="{
            minRows: 3
          }"
          class="w-full resize-none appearance-none rounded-lg p-2 ring-1 ring-slate-900/10 focus:ring-2 focus:ring-black"
          placeholder="输入内容"
        />
        <n-button type="primary" :loading="loading" @click="copy(resData)">
          全部复制
        </n-button>
      </div>
    </div>
  </div>
</template>
