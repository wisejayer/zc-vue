<template>
  <div class="view" v-loading="loading">
    <!--搜索-->
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="search"
      prefix-icon="el-icon-search">
    </el-input>
    <!--表格-->
    <el-table
      :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :default-sort = "{prop: 'adddate'}"
      >
      <el-table-column
        prop="adddate"
        label="日期"
        sortable 
        width="180">
      </el-table-column>
      <el-table-column
        prop="addname"
        label="加分名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="addtype"
        label="加分类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="addmark"
        label="分值"
        width="100">
      </el-table-column>
      <el-table-column
        prop="adddesc"
        label="加分说明"
        width="300">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="是否审批"
        align="center">
      </el-table-column>
      <el-table-column
        prop="addpath"
        label="加分证明"> 
        <template slot-scope="scope">
           <el-popover
            placement="left"
            trigger="click">
            <el-image slot="reference" :src="scope.row.addpath" style="width: 100px; height: 100px"></el-image>
            <el-image  :src="scope.row.addpath" style="width: 700px; height: 700px"></el-image>
           </el-popover>
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
  export default {
    data() {
      return {
        tableData: [],//后台拿来数据
        currentPage: 1, // 当前页码
        pageSize: 5, // 每页的数据条数
        search: '',
        loading: false
      }
    },
    methods: {
      formatter(row, column) {//格式化
        return row.addname;
      },
       //当前页改变时触发 跳转其他页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      getHistory(){
        this.loading = true;
        this.getRequest("/student/list").then(resp=> {
          if (resp && resp.status == 200) {
            this.loading = false;
           this.tableData = resp.data
          }
        })    
      }
    },
    mounted: function () {
      this.getHistory()
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