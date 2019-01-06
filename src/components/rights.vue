<template>
  <el-card class="box-card">
    <my-bread level1="权限管理" level2="权限管理"></my-bread>
    <template>
      <el-table
        :data="tableData"
        stripe
        class="table"
        style="width: 100%">
        <el-table-column
          type=index
          label="#"
          width="180">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          label="层级">
          <template slot-scope="scope">
              <span v-if="scope.row.level==='0'">一</span>
               <span v-if="scope.row.level==='1'">二</span>
                <span v-if="scope.row.level==='2'">三</span>
          </template>
        </el-table-column>
      </el-table>
      </template>
  </el-card>
</template>

<script>
export default {
  created () {
    this.getInfo()
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    async getInfo () {
      const res = await this.$http.get(`rights/list`)
      this.tableData = res.data.data
      console.log(this.tableData)
    }
  }

}
</script>

<style>
.box-card{
    height: 100%;
}
.table{
    margin-top: 20px;
    height: 500px;
    overflow: auto;
}
</style>
