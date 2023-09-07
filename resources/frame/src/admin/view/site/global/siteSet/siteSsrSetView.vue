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

    <Card class="site-seo-explain">
      <div class="site-seo-explain__box">
        <p class="site-seo-explain__box-introduce">
          由于DISCUZ!Q的技术框架约束，我们无法提供传统的静态文件输出方案，为实现站点的SEO，我们采用了SSR的解决方案；
        </p>
        <p class="site-seo-explain__box-introduce">SSR，即Server Side Render(服务端渲染)，服务端将React组件渲染为静态HTML。</p>
        <p class="site-seo-explain__box-introduce">
          开始之前您首先完成以下设置:
        </p>
        <div class="site-seo-explain__box-btn">
          <span @click="flipClick('qcloud_close')">云API</span>
          <span @click="flipClick('qcloud_server')">SSR存储</span>
        </div>
      </div>
    </Card>

    <Card>
      <div class="site-seo-address">
        <p class="site-seo-address__nginx">Nginx 配置</p>
        <p class="site-seo-address__describe"> 完成上述的设置后，请将以下配置复制到您站点的Nginx配置中</p>
        <div class="site-seo-address__ssrtext" id="sharedurl" ref="indexesText">
          <!-- <el-input
            type="textarea"
            ref="indexesText"
            :autosize="{ minRows: 10, maxRows: 20}"
            v-model="ssrText">
          </el-input> -->
          vhosts.conf nginx配置文件（不建议全量）<br>
          # -----------------全量---------------------- <br>
          server { <br>
            &nbsp;&nbsp; ...原始配置 <br>
              <br>
              &nbsp;&nbsp;location / { <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_pass {{configPath}};  //代理需要变化 <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_connect_timeout        10; <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_send_timeout           15; <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_read_timeout           20; <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_buffer_size            1M; <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_buffers                8 1M; <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_busy_buffers_size      1M; <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_temp_file_write_size   1M; <br>
              &nbsp;&nbsp;} <br>
          } <br>
          <br>
          vhosts.conf  nginx配置文件（推荐配置） <br>
          # 爬虫请求头判断 <br>
          map $http_user_agent $ua_device { <br>
            &nbsp;&nbsp;default 'desktop'; <br>
            &nbsp;&nbsp;~*Baiduspider|Yisouspider|Googlebot|spider|Spider|360Spider|bingbot|Sosospider/i 'bot'; <br>
            &nbsp;&nbsp;~*(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge\ |maemo|midp|mmp|mobile.+firefox|netfront|opera\ m(ob|in)i|palm(\ os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows\ ce|xda|xiino/i 'mobile'; <br>
            &nbsp;&nbsp;~*android|ipad|playbook|silk/i 'tablet'; <br>
          } <br>
          # --------------- 爬虫流量--------------- <br>
          server { <br>
              &nbsp;&nbsp;...原始配置 <br>
              <br>
              &nbsp;&nbsp;set $dst $uri; <br>
              &nbsp;&nbsp;set $dst2 $uri/; <br>
              &nbsp;&nbsp;set $dst3 /index.php?$query_string; <br>
              <br>
              &nbsp;&nbsp;if ($ua_device = 'bot') { <br>
              &nbsp;&nbsp;&nbsp;&nbsp;set $dst2 ""; <br>
              &nbsp;&nbsp;&nbsp;&nbsp;set $dst3 @proxypass; <br>
              &nbsp;&nbsp;} <br>
              <br>
              &nbsp;&nbsp;location / { <br>
                &nbsp;&nbsp;&nbsp;&nbsp;try_files $dst $dst2 $dst3; <br>
              &nbsp;&nbsp;} <br>
              &nbsp;&nbsp;location @proxypass { <br>
                &nbsp;&nbsp;&nbsp;&nbsp;proxy_pass {{configPath}}; //代理需要变化 <br>
                &nbsp;&nbsp;&nbsp;&nbsp;proxy_connect_timeout        10; <br>
                &nbsp;&nbsp;&nbsp;&nbsp;proxy_send_timeout           15; <br>
                &nbsp;&nbsp;&nbsp;&nbsp;proxy_read_timeout           20; <br>
                &nbsp;&nbsp;&nbsp;&nbsp; proxy_buffer_size            1M; <br>
                &nbsp;&nbsp;&nbsp;&nbsp;proxy_buffers                8 1M; <br>
                &nbsp;&nbsp;&nbsp;&nbsp;proxy_busy_buffers_size      1M; <br>
                &nbsp;&nbsp;&nbsp;&nbsp;proxy_temp_file_write_size   1M; <br>
              &nbsp;&nbsp;} <br>
          } <br>
        </div>
      </div>
    </Card>

    <Card class="footer-btn">
      <el-button
        type="primary"
        @click="optionBtn"
        >复制</el-button
      >
    </Card>
  </div>
</template>

<script>
  import "../../../../scss/site/module/globalStyle.scss";
  import siteDataRulesCon from "../../../../controllers/site/global/siteSet/siteSsrSetCon";
  export default {
    name: "site-ssr-set",
    ...siteDataRulesCon
  };
</script>