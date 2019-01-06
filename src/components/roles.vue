<template>
  <el-card class="box-card">
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-button class="btn" type="success">添加角色</el-button>
    <el-table
    :data="tableData"
    stripe
    class="table"
    style="width: 100%">
      <el-table-column
      type="expand"
      width="180">
        <template slot-scope="scope">
          <el-row  v-for="(item1,i) in scope.row.children" :key="i">
              <el-col :span="4">
                  <el-tag closable type="success"  @close="handleClose(scope.row,item1.id)">
                       {{item1.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                  <el-row  v-for="(item2,i) in item1.children" :key="i">
                      <el-col :span="4">
                          <el-tag closable type="info"   @close="handleClose(scope.row,item2.id)">
                              {{item2.authName}}
                          </el-tag>
                          <i class="el-icon-arrow-right"></i>
                      </el-col>
                      <el-col :span="20">
                          <el-tag closable type="warning" v-for="(item3,i) in item2.children" :key="i"  @close="handleClose(scope.row,item3.id)">
                              {{item3.authName}}
                          </el-tag>
                      </el-col>
                  </el-row>
              </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
              <el-col>
                  <span>该角色未分配任何权限</span>
              </el-col>
          </el-row>
        </template>
    </el-table-column>
    <el-table-column
      type=index
      label="#"
      width="180">
    </el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称">
    </el-table-column>
    <el-table-column
      prop="roleDesc"
      label="角色描述">
    </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button @click="showEdit(scope.row)" type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
            <el-button @click="delUser(scope.row)" type="danger"  size="mini" plain icon="el-icon-delete" circle></el-button>
            <el-button @click="showTree(scope.row)" type="success" size="mini" plain icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
  </el-table>

<el-dialog
  title="分配权限"
  :visible.sync="dialogVisible"
  width="50%"
  >
  <el-tree
  ref="tree"
  default-expand-all
  :data="roleInfo"
  show-checkbox
  node-key="id"
  :default-checked-keys="checkdeRole"
  :props="defaultProps">
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeRole">确 定</el-button>
  </span>
</el-dialog>

     </el-card>
</template>

<script>
export default {
  created () {
    this.getInfo()
  },
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      roleInfo: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkdeRole: [],
      changeUserId: ''
    }
  },
  methods: {
    showEdit () {},
    delUser () {},
    showRole () {},
    async getInfo () {
      const res = await this.$http.get(`roles`)
      this.tableData = res.data.data
    },
    async handleClose (roles, rightId) {
      const res = await this.$http.delete(`roles/${roles.id}/rights/${rightId}`)
      roles.children = res.data.data
    },
    async showTree (user) {
      const res = await this.$http.get(`rights/tree`)
      this.roleInfo = res.data.data
      this.dialogVisible = true
      this.changeUserId = user.id
      const tempArr = []
      user.children.forEach((item1) => {
        item1.children.forEach((item2) => {
          item2.children.forEach((item3) => {
            tempArr.push(item3.id)
          })
        })
      })
      this.checkdeRole = tempArr
      console.log(this.checkdeRole)
    },
    async changeRole () {
      const arr1 = this.$refs.tree.getCheckedKeys()
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.changeUserId}/rights`, {
        rids: arr.join(',')
      })
      this.$message.success(res.data.meta.msg)
      this.dialogVisible = false
      this.getInfo()
    }
  }

}
</script>

<style>
.btn{
    margin-top: 20px;
    width: 100px;
}
.el-tag{
    margin: 2px 5px 0;
}
</style>
