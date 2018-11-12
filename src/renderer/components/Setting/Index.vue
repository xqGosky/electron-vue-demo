<template>
  <div class="set-warp">
    <div class="set-left">
      <p class="set-title">小票设置</p>
      <!--小票设置-->
      <el-form style="padding: 15px;border-bottom: 1px solid #e4e4e4">
        <el-form-item label="小票尺寸">
          <el-radio-group v-model="radio2">
            <el-radio :label="58">58</el-radio>
            <el-radio :label="76">76</el-radio>
            <el-radio :label="80">80</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顶端空行数">
          <el-input-number v-model="num1" @change="handleChange" :min="0" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="底端空行数">
          <el-input-number v-model="num2" @change="handleChange" :min="0" :max="10" label="底端空行数"></el-input-number>
        </el-form-item>
        <el-switch
          v-model="showShopName"
          inactive-text="打印店铺">
        </el-switch>
        <el-form-item label="打印店铺名称" :inline="true">
          <el-input v-model="shopNmae"></el-input>
        </el-form-item>
      </el-form>
      <!--店铺设置-->
      <el-form class="shop-set">
      
      </el-form>
    </div>
    <div class="set-right"></div>
  
  </div>
</template>
<script>
  export default {
    data () {
      return {
        radio2: 58,
        num1: 0,
        num2: 0,
        showShopName: true,
        shopNmae: ''
      }
    },
    mounted () {
  
    },
    methods: {
      handleChange () {
  
      }
    }
  }
</script>

<style scoped>

</style>
