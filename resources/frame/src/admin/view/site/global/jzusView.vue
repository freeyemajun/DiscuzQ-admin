<template>
  <div class="jsus-box">
    <Card class="jsus-card-box" header="捐助人列表" intercept="true">
      <p class="section">
        <el-tag v-for="(item,index) in userlist" :key="index" style="margin-left: 10px;margin-bottom: 10px">{{ item }}</el-tag>
      </p>
    </Card>
    <Card class="jsus-card-box" header="捐助我们" intercept="true">
      <p class="section">
        <el-link @click="open" target="_blank">点击捐助</el-link>
      </p>
    </Card>
  </div>
</template>

<script>
import "../../../scss/site/module/globalStyle.scss";
import jzusCon from "../../../controllers/site/global/jzusCon";
export default {
  name: "jzusView",
  ...jzusCon,
};
</script>

<style scoped>

</style>
