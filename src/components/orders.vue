<template>
    <el-card class="card">
        <my-bread level1="订单管理" level2="订单列表"></my-bread>
         <el-table
      height="450px"
      border
      stripe
      :data="list"
      style="width: 100%">

      <!-- 序号 -->
      <el-table-column
      type="index">
      </el-table-column>

      <el-table-column
        prop="order_number"
        label="订单编号"
        >
      </el-table-column>

      <el-table-column
        prop="order_price"
        label="订单价格"
        width="100">
      </el-table-column>

      <el-table-column
        prop="order_pay"
        label="是否付款"
        width="80">
        <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.order_pay ==='0'">已付款</el-tag>
            <el-tag type="primary" v-if="scope.row.order_pay ==='1'">未付款</el-tag>
        </template>
      </el-table-column>
     <el-table-column
        prop="is_send"
        label="是否发货"
        width="80">
      </el-table-column>

      <el-table-column
        label="下单时间" width="120">
        <template slot-scope="scope">
            {{scope.row.create_time | fmdata}}
        </template>
      </el-table-column>

      <el-table-column
        label="操作" width="100">
        <template slot-scope="scope">
        <el-button  plain size="mini" type="primary" @click="showChange" icon="el-icon-edit" circle></el-button>
        </template>
      </el-table-column>
  </el-table>

   <el-dialog title="修改订单地址" :visible.sync="dialogFormVisibleOrder">
  <el-form>
     <el-form-item label="省市区" label-width="200">
     <el-cascader
    :props="defaultProps"
    :options="options"
    v-model="selectedOptions"
     expand-trigger="hover">
  </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" label-width="200">
        <el-input v-model="insertInfo"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleOrder = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisibleOrder = false">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>

<script>
import catlist from '@/assets/city_data2017_element'
export default {
    data(){
        return{
            list:[],
            insertInfo:'',
             defaultProps:{
                children:'children',
                value: "cat_id",
                label:'cat_name',
            },
        selectedOptions:[],
        options:[],
        dialogFormVisibleOrder:false
        }
    },methods:{
        async getInfo(){
             const res = await this.$http.get(`orders?pagenum=1&pagesize=10`);
            console.log(res)
            this.list = res.data.data.goods
        },showChange(){
        this.dialogFormVisibleOrder = true
        this.options = catlist
    }
    },created(){
        this.getInfo()
    }

}
</script>

<style>
.card{
    height: 100%;
}
</style>
