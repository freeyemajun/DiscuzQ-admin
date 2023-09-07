<template>
  <div class="config-serverless">
    <Card class="config-cdn-domain">
      serverless配置
    </Card>

    <Card class="config-cdn-domain">
      <span class="config-cdn-domain__name"> 配置地区 </span>
      <el-input
        v-model="configAddress"
        class="elinput"
        style="height: 36px; width: 400px"
        size="small"
      ></el-input>
    </Card>

    <Card class="config-cdn-domain"> 
      <span class="config-cdn-domain__name"> 配置存储桶名称 </span>
      discuz-ssr- 
      <el-input
        v-model="configName"
        placeholder="请填写appid"
        class="elinput"
        style="height: 36px; width: 200px"
        size="small"
      ></el-input>
    </Card>
    
    <Card class="config-serve" v-if="configPatn"> 
      <span class="config-serve__name"> 返回地址 </span>
      <span><a :href="configPatn" target="_blank">{{configPatn}}</a></span>
    </Card>

    <Card class="register-option-btn">
      <el-button
        type="primary"
        :loading="subLoading"
        size="medium"
        @click="submitClick"
      >提交</el-button>
    </Card>
  </div>
</template>

<script>
import "../../../../scss/site/module/globalStyle.scss";
import tencentCloudServerCon from "../../../../controllers/site/global/tencentCloundSet/tencentCloudServerCon";

export default {
  name: "tencent-cloud-server",
  ...tencentCloudServerCon,
};
</script>