<template>
  <div class="annex-set-box">
    <Card header="支持的图片扩展名：">
      <CardRow description="多个请用,隔开，例如 png,gif,jpg,jpeg,heic">
        <el-input v-model="picture"></el-input>
      </CardRow>
    </Card>

    <Card header="支持的文件扩展名：">
      <CardRow description="多个请用,隔开，例如 doc,docx,pdf,zip">
        <el-input v-model="fileExtension"></el-input>
      </CardRow>
    </Card>

    <Card header="支持的最大尺寸：">
      <CardRow description="单位：MB">
        <el-input v-model="maximumSize" type="number" @blur.native.capture="onblurFun"></el-input>
        <template #tail>
            <a href="https://discuz.com/manual-admin/2.html#_2-5-%E9%99%84%E4%BB%B6%E8%AE%BE%E7%BD%AE" target="_blank" style="margin-left: 15px;">附件尺寸设置指南</a>
        </template>
      </CardRow>
    </Card>

     <Card header="用户一天内可下载附件次数：" class="annex-set-box__copy">
      <CardRow>
        <el-radio
          v-model="restrictionsOn"
          label="1"
        >不限制</el-radio>
        <el-radio v-model="restrictionsOn" label="2">
          自定义
        </el-radio>
        <el-input
          class="elinput"
          style="height: 36PX;width: 100PX"
          type="number"
          size="small"
          v-model="downloads"
          @input="downloadsNumInput"
        ></el-input>次
        <span class="annex-set-box__copy-span">如果在用户设置中开启了游客可下载附件权限，则游客下载不受次数限制</span>
      </CardRow>
    </Card>
    
    <Card header="发帖时一次性可添加附件数：" class="annex-set-box__limit">
      <CardRow>
        <el-input
          class="elinput"
          style="height: 36PX;width: 100PX"
          type="number"
          size="small"
          v-model="quantityLimit"
        ></el-input>个
        <span class="annex-set-box__limit-title">最多可设置{{maxUpload}}个</span>
      </CardRow>
    </Card>
    <Card class="footer-btn">
      <el-button type="primary" size="medium" @click="submi">提交</el-button>
    </Card>

  </div>
</template>

<script>
import annexSetCon from '../../../controllers/site/global/annexSetCon';
import '../../../scss/site/module/globalStyle.scss';
export default {
    name: "annex-set-view",
  ...annexSetCon
}
</script>
