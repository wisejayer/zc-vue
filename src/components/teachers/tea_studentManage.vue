<template>
  <div class="view" >
    <el-row>
      <el-col :span="1">学号:</el-col>
      <el-col :span="4"><el-input v-model="form.userid" placeholder="请输入学号" prefix="学号："></el-input></el-col>
      <el-col :span="1">姓名:</el-col>
      <el-col :span="4"><el-input  v-model="form.username" placeholder="请输入姓名"></el-input></el-col>
      <el-col :span="2"><el-button type="primary" @click="submit">任命</el-button></el-col>
      <el-col :span="5" :push="6"><el-input placeholder="输入关键字进行过滤" v-model="search" prefix-icon="el-icon-search"></el-input></el-col>
    </el-row>
    <!--表格-->
    <el-table
      v-loading="loading"
      :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :default-sort = "{prop: 'date'}"
      >
      <el-table-column
        prop="userid"
        label="学号"
        sortable 
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="gradename"
        label="班级">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150">
        <template slot-scope="scope">
          <el-button @click="passRow(scope.row)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block" style="margin-top:15px;">
            <el-pagination align='center' @current-change="handleCurrentChange" 
            :current-page="currentPage" 
            :page-size="pageSize" 
            layout="total, prev, pager, next, jumper" 
            :total="tableData.length">
            </el-pagination>
    </div>
    
  </div>
</template>

<script>
import {Message} from 'element-ui'
  export default {
    data() {
      return {
        tableData: [],
        currentPage: 1, // 当前页码
        pageSize: 5, // 每页的数据条数
        form:{
          userid:'',
          username:'',
          gradename:''
        },
        search: '',
        loading: false
      }
    },
    mounted(){
      this.getmonitor()
      this.loading = true
    },
    methods: {
       //当前页改变时触发 跳转其他页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      submit() {
        this.postRequest('/teacher/add',this.form).then(resp=> {
          if (resp && resp.status == 200) {
          }
        });      
      },
      passRow(row) {
       this.$confirm('此操作将永久删除是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("/teacher/delete/"+row.userid).then(resp=>{
            if (resp && resp.status == 200) {
            }
           })
        }).catch(() => {
        });
      },
      getmonitor(){
        this.getRequest('teacher/monitor').then(resp=> {  
          if (resp && resp.status == 200) {       
            this.loading = false
            this.tableData=resp.data
          }
         })
      }
    },
    computed: {
    // 模糊搜索
      tables () {
        var search = this.search
        if (search) {
          // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
          // 注意： filter() 不会对空数组进行检测。
          // 注意： filter() 不会改变原始数组。
          return this.tableData.filter(data => {
            // some() 方法用于检测数组中的元素是否满足指定条件;
            // some() 方法会依次执行数组的每个元素：
            // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
            // 如果没有满足条件的元素，则返回false。
            // 注意： some() 不会对空数组进行检测。
            // 注意： some() 不会改变原始数组。
            return Object.keys(data).some(key => {
              // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
              // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      }
    }
  }
</script>

<style>

</style>