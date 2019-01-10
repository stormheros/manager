<template>
    <el-card class="box-card">
      <my-bread level1="用户管理" level2="用户列表"></my-bread>
 <el-row>
<el-input @blur="searchInfo" @clear="clean" placeholder="请输入内容" v-model="query" clearable class="input-with-select">
    <el-button @click="searchInfo" slot="append" icon="el-icon-search"></el-button>
  </el-input>
  <el-button @click="showAdd" type="success">我要添加</el-button>
 </el-row>
 <el-table
      v-loading="loads"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="#"
        width="80">
      </el-table-column>
       <el-table-column
        prop="username"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="120">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建日期"
        width="180" >
        <template slot-scope="scope">
          {{scope.row.create_time | fmdata}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-switch
           v-model="scope.row.mg_state"
           @change="changeState(scope.row)"
           active-color="#13ce66"
           inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button @click="showEdit(scope.row)" type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
            <el-button @click="delUser(scope.row)" type="danger"  size="mini" plain icon="el-icon-delete" circle></el-button>
            <el-button @click="showRole(scope.row)" type="success" size="mini" plain icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

<!-- 添加页面 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="form">
    <el-form-item label="用户名" label-width="300">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
        <el-form-item label="邮箱" label-width="300">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
        <el-form-item label="密码" label-width="300">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
        <el-form-item label="电话" label-width="300">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </div>
</el-dialog>

<!-- 编辑页面 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
     <el-form :model="form">
    <el-form-item label="用户名" label-width="300">
      <el-input disabled v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
        <el-form-item label="邮箱" label-width="300">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
        <el-form-item label="电话" label-width="300">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </div>
</el-dialog>
<!-- 分配角色 -->
<el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
  <el-form>
    <el-form-item label="用户名" label-width="200">{{currUsername}}
    </el-form-item>
    <el-form-item label="角色" label-width="200">
      <el-select v-model="currRoleId">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>

      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="changeRoles">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>

<script>
export default {
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getDate()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getDate()
    },
    async getDate () {
      const res = await this.$http.get(`users?query=${this.query}&pagesize=${this.pagesize}&pagenum=${this.pagenum}`)
      const {data: {total, users}, meta: {status, msg}} = res.data
      if (status === 200) {
        this.loads = false
        this.$message.success(msg)
        this.tableData = users
        this.total = total
      }
    },
    searchInfo () {
      this.pagenum = 1
      this.getDate()
    },
    clean () {
      this.query = ''
      this.pagenum = 1
      this.getDate()
    },
    showAdd () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    async addUser () {
      const res = await this.$http.post('users', this.form)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.dialogFormVisibleAdd = false
        this.getDate()
      } else {
        this.$message.warning(msg)
      }
    },
    delUser (user) {
      this.$confirm('将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${user.id}`)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.pagenum = 1
          this.getDate()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    async showEdit (user) {
      this.dialogFormVisibleEdit = true
      const res = await this.$http.get(`users/${user.id}`)
      const {data, meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.form = data
      }
    },
    async editUser () {
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleEdit = false
        this.getDate()
      } else {
        this.$message.info(msg)
      }
    },
    async changeState (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res)
    },
    async showRole (user) {
      this.dialogFormVisibleRole = true
      const res = await this.$http.get(`roles`)
      this.roles = res.data.data
      this.currUsername = user.username
      this.currUserId = user.id
      const resU = await this.$http.get(`users/${user.id}`)
      this.currRoleId = resU.data.data.rid
    },
    async changeRoles () {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {rid: this.currRoleId})
      console.log(res)
      this.dialogFormVisibleRole = false
    }
  },
  created () {
    this.getDate()
  },
  data () {
    return {
      query: '',
      pagesize: 2,
      pagenum: 1,
      total: -1,
      tableData: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      currentPage: 2,
      form: {},
      currRoleId: -1,
      roles: [],
      currUsername: '',
      currUserId: '',
      loads: true
    }
  }
}
</script>

<style>
.box-card{
    height: 100%;
}
.input-with-select{
    margin-top: 20px;
    width: 300px;
}
</style>
