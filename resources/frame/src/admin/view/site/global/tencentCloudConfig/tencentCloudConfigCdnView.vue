<template>
  <div class="config-cdn">
    <Card class="config-cdn-title">
      <span class="config-cdn-title__left">CDN配置</span>
      <span>如需更改更多配置项请进入腾讯云<a href="https://console.cloud.tencent.com/cdn" target="_blank">CDN控制台</a></span>
    </Card>

    <Card class="config-cdn-domain">
      <span class="config-cdn-domain__name"> 加速域名 </span>
      <el-input
        v-model="accelerateData"
        class="elinput"
        style="height: 36px; width: 200px"
        size="small"
      ></el-input>
    </Card>

    <Card class="config-cdn-address">
      <p class="config-cdn-address__text">源站地址</p>
      <div class="config-cdn-address__box">
        <el-input
          class="config-cdn-address__input"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="originAddress"
        >
        </el-input>
        <div>
          <p class="config-cdn-address__lower">
            支持填充多个IP源站（一行一个）或一个域名源站
          </p>
          <p class="config-cdn-address__lower">
            支持增加配置端口（0-65535）和权重（1-100）: 源站:端口:权重（端口可缺省：源站:权重）
          </p>
          <p class="config-cdn-address__lower">
            若选择HTTPS回源，端口仅可配置为443或不配置端口
          </p>
          <p class="config-cdn-address__lower">
            最多可填充511个字符
          </p> 
        </div>
      </div>
    </Card>

    <Card class="config-cdn-domain">
      <span class="config-cdn-domain__name"> 回源HOST </span>
      <el-input
        v-model="sourceHost"
        class="elinput"
        style="height: 36px; width: 400px"
        size="small"
      ></el-input>
    </Card>
    
    <Card class="config-cdn-domain">
      <span class="config-cdn-domain__name"> 主域名 </span>
      <el-input
        v-model="mainDomain"
        class="elinput"
        style="height: 36px; width: 400px"
        size="small"
      ></el-input>
    </Card>

    <Card class="register-option-btn">
      <el-button
        type="primary"
        :loading="subLoading"
        size="medium"
        @click="submitClick"
      >提交</el-button>

      <el-button
        type="primary"
        size="medium"
        :loading="purgeCdnLoading"
        @click="purgeCdnClick"
      >清除缓存</el-button>
    </Card>
  </div>
</template>

<script>
import "../../../../scss/site/module/globalStyle.scss";
import tencentCloudConfigCdnCon from "../../../../controllers/site/global/tencentCloundSet/tencentCloudConfigCdnCon";

export default {
  name: "tencent-cloud-config-cloud-view",
  ...tencentCloudConfigCdnCon,
};
</script>