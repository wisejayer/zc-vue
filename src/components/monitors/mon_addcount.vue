<template>
  <div class="view">

    <div style="text-align:left">
    <el-tag style="font-size:15px;" class="el-icon-caret-right">根据班级进行查看成绩：</el-tag>
    <el-select v-model="gradeid" filterable placeholder="请选择" size="small">    
      <el-option
        v-for="item in gradeinfo"
        :key="item.gradeid"
        :label="item.gradename"
        :value="item.gradeid">
      </el-option>
    </el-select>
    <el-button type="primary" icon="el-icon-search" size="small" @click="getmark">搜索</el-button>
    <el-button type="success" size="small" @click="exportmark()" v-if="this.able">导出数据
    </el-button>
    </div>

    <el-table
    :data="tableData"
    stripe
    style="width: 100%"
    height="450">
    <el-table-column
      prop="username"
      label="姓名"
      width="150">
    </el-table-column>
    <el-table-column
      prop="userid"
      label="学号"
      sortable 
      width="150">
    </el-table-column>
    <el-table-column
      prop="type1"
      label="专业技能"
      width="150">
    </el-table-column>
    <el-table-column
      prop="type2"
      label="创造能力"
      width="150">
    </el-table-column>
    <el-table-column
      prop="type3"
      label="文体能力"
      width="150">
    </el-table-column>
    <el-table-column
      prop="type4"
      label="组织管理能力"
      width="150">
    </el-table-column>
    <el-table-column
      prop="type5"
      label="社会实践能力"
      width="150">
    </el-table-column>
    <el-table-column
      prop="mark"
      label="总分"
      sortable 
      width="150">
    </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        gradeinfo: [],
        gradeid: '',
        tableData: [],
        able:false
      }
    },
    methods: {
      getgarde(){
        this.getRequest("/monitor/grade").then(resp=> {
          if (resp && resp.status == 200) { 
           this.gradeinfo = resp.data
          }
        })   
      },
      getmark(){
        this.tableData = []
        this.getRequest("/monitor/mark/"+this.gradeid).then(resp=> {
          if (resp && resp.status == 200) {
            this.able=true
            this.tableData = resp.data
          }
        }) 
      },
      exportmark(){
          window.open("/monitor/export/"+this.gradeid, "_parent");
      }
    },
    mounted(){
      this.getgarde();
    }
  }
</script>