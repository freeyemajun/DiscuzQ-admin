<template>
  <div class="home-box">

<!--    <Card class="home-card-box" id="other_content_header" intercept="true" style="border:0;padding:0;">-->
<!--    </Card>-->

    <Card class="home-card-box" header="待处理事项" intercept="true">
      <p class="pending-p">
        等待审核的主题数
        <router-link
          to="/admin/cont-review"
          style="color: #336699;"
        >(&nbsp;{{unapproved.unapprovedThreads}}&nbsp;)</router-link>
      </p>
      <p class="pending-p">
        等待审核的回复数
        <router-link
          to="/admin/reply-review"
          style="color: #336699;"
        >(&nbsp;{{unapproved.unapprovedPosts}}&nbsp;)</router-link>
      </p>
      <p class="pending-p">
        等待审核的提现数
        <router-link
          to="/admin/withdrawal-application"
          style="color: #336699;"
        >(&nbsp;{{unapproved.unapprovedMoneys}}&nbsp;)</router-link>
      </p>
      <p class="pending-p">
        等待审核的用户数
        <router-link
          to="/admin/user-review"
          style="color: #336699;"
        >(&nbsp;{{unapproved.unapprovedUsers}}&nbsp;)</router-link>
      </p>
    </Card>

    <Card class="home-card-box" header="系统信息" intercept="true">
      <p class="section">
        <span class="section-title">Discuz!Q<br> (知识付费社区)系统<br>（React）版本：</span>
        <span>{{siteInfo.version}}</span>
        <span v-if="newVersion" class="section-title section-title-right">
          <span>[</span>
          <a href="https://discuzq.cc/index.php?s=quan&c=show&id=1" target="_blank">新版本： {{versionNumber}}</a>
          <span>]</span>
        </span>
        <span class="section-title section-title-right">
          <a href="https://discuzq.cc/" target="_blank">官方社区：discuzq.cc</a>
        </span>
      </p>
      <p class="section">
        <span class="section-title">服务器系统及PHP：</span>
        <span>{{siteInfo.phpVersion}}</span>
      </p>
      <p class="section">
        <span class="section-title">服务器软件：</span>
        <span>{{siteInfo.serverSoftware}}</span>
      </p>
      <p class="section">
        <span class="section-title">服务器MySQL版本：</span>
        <span>{{siteInfo.db}}</span>
      </p>
      <p class="section">
        <span class="section-title">上传许可：</span>
        <span>{{siteInfo.uploadSize}}</span>
      </p>
      <p class="section">
        <span class="section-title">当前数据库尺寸：</span>
        <span>{{siteInfo.dbSize}}</span>
      </p>
      <p class="section">
        <span class="section-title">开源贡献者：</span>
        <span><a href="https://discuzq.cc/user/1" target="_blank">盛想团队：张安冠</a></span>
      </p>
      <p class="section">
        <span class="section-title">捐助我们：</span>
        <span><router-link
          to="/admin/jzus"
          style="color: #336699;"
        > 点击进入</router-link></span>
      </p>
    </Card>

    <Card class="home-card-box home-card__footer" id="other_content_footer" header="相关链接">
      <a href="https://developer.discuz.chat/" target="_blank">使用手册</a>
      <a href="https://discuzq.cc/" target="_blank">Discuz! Q 开源社区</a>
      <a href="https://q.discuzq.cc/" target="_blank">Discuz! Q 老站</a>
    </Card>
  </div>
</template>

<script>
//
import "../../../scss/site/module/globalStyle.scss";
import homeCon from "../../../controllers/site/home/homeCon";
export default {
  name: "home-view",
  ...homeCon,
};
</script>
