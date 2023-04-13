<script setup lang="ts">
import { User } from '@prisma/client'
import type { DataTableColumns } from 'naive-ui'

const { $client } = useNuxtApp()
const loading = ref(false)
const tableData = ref<User[]>([])
const columns = ref<DataTableColumns<User>>([
  {
    title: 'id',
    key: 'id'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '邮箱',
    key: 'email'
  }
])
const getTableData = async () => {
  loading.value = true
  const res = await $client.user.list.query()
  console.log(res)
  tableData.value = res
  // pagination.total = res.data.value?.total || 0
  loading.value = false
}
onMounted(() => {
  getTableData()
})
</script>

<template>
  <div class="h-full overflow-hidden">
    <n-card title="用户管理" :bordered="false" class="rounded-16px shadow-sm">
      <n-space class="pb-12px" justify="space-between">
        <n-space>
          <n-button type="primary" @click="handleAddTable">
            <icon-ic-round-plus class="mr-4px text-20px" />
            新增
          </n-button>
          <n-button type="error">
            <icon-ic-round-delete class="mr-4px text-20px" />
            删除
          </n-button>
          <n-button type="success">
            <icon-uil:export class="mr-4px text-20px" />
            导出Excel
          </n-button>
        </n-space>
        <n-space align="center" :size="18">
          <n-button size="small" type="primary" @click="getTableData">
            <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
            刷新表格
          </n-button>
          <column-setting v-model:columns="columns" />
        </n-space>
      </n-space>
      <n-data-table :columns="columns" :data="tableData" :loading="loading" :pagination="pagination" />
    </n-card>
  </div>
</template>
