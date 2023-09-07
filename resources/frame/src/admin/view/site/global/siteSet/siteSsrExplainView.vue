<template>
  <div class="site-seo">
    <!-- <Card class="site-seo-nav">
      <p class="site-seo-nav__map"  @click="jumpDataRules">推荐首页</p>
      <p class="site-seo-nav__ssr repeat">数据规则</p>
    </Card> -->
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#fff"
      text-color="#333333"
      active-text-color="#336699">
      <el-menu-item index="1">站点地图</el-menu-item>
      <el-menu-item index="2">静态输出(SSR)</el-menu-item>
      <el-menu-item index="3">使用说明</el-menu-item>
    </el-menu>

    <Card>
      <div class="ssr-explain">
        <p class="ssr-explain-title">1. 生成ssr.zip</p>
        <p class="ssr-explain-text">进入前端工程目录discuz-fe\web 下，如果是首次打包ssr.zip ，依次执行 npm install , npm run sls:create , 
          此时会在根目录下生成一个配置文件sls.config.yaml ，进入该配置文件填写secretId secretKey appid(上腾讯云控制台查看)  填好配置文件后，再依次执行npm run build , 
          npm run sls:build , 此时在web\.sls 下就会生成ssr.zip
        </p>
        <p class="ssr-explain-title">2. 上传 ssr.zip 压缩包至项目根目录</p>
        <p class="ssr-explain-title">3. 腾讯云账号须开通cos对象存储、云函数功能</p>
        <p class="ssr-explain-title">4. SSR填写规则：</p>
        <div class="ssr-explain-img">
          <img  src="/static-admin/images/ssr.png" alt="">
        </div>
        <p class="ssr-explain-title">Appid ：到腾讯云控制台 “账号中心”查看 账号信息 下的 APPID</p>
        <div class="ssr-explain-img">
          <img  src="/static-admin/images/appid.png" alt="">
        </div>
        <p class="ssr-explain-title">配置地区填写规则：</p>
        <div class="ssr-explain-img">
          <img  src="/static-admin/images/adds.png" alt="">
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import "../../../../scss/site/module/globalStyle.scss";
  import siteSsrExplainCon from "../../../../controllers/site/global/siteSet/siteSsrExplainCon";
  export default {
    name: "site-ssr-set",
    ...siteSsrExplainCon
  };
</script>