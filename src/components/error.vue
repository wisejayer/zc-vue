<template>
    <div>
    <el-page-header @back="goBack" content="你好像走丢了哦"></el-page-header>
     <el-calendar>
         <template
            slot="dateCell"
            slot-scope="{date, data}">
            <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
            </p>
            </template>
    </el-calendar>   
    </div>
</template>

<script>
  export default {
    methods: {
      goBack() {
        this.$router.push({ path:'/home'});
      }
    }
  }
</script>

<style>
  .is-selected {
    color: #1989FA;
  }
</style>