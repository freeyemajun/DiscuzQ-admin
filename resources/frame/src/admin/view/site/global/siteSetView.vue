<template>
  <div class="site-set-box">
    <Card header="站点名称：">
      <CardRow description="你的Discuz! Q 站点的名称">
        <el-input placeholder="站点名称" v-model="siteName"></el-input>
      </CardRow>
    </Card>

    <Card header="站点介绍：">
      <CardRow description="你的Discuz! Q 站点的介绍">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="站点介绍" v-model="siteIntroduction">
        </el-input>
      </CardRow>
    </Card>
    <Card header="站点keywords：">
      <CardRow description="你的Discuz! Q 站点的keywords">
        <el-input placeholder="站点keywords" v-model="siteKeywords"></el-input>
      </CardRow>
    </Card>
    <Card header="站点首页标题：">
      <CardRow description="你的Discuz! Q 站点的首页标题">
        <el-input placeholder="站点首页标题" v-model="siteTitle"></el-input>
      </CardRow>
    </Card>

    <Card header="是否开启用户登陆AES加密">
      <CardRow class="card-pay" description="是否开启用户登陆AES加密。">
        <el-switch
          v-model="loginaes"
          active-color="#336699"
          inactive-color="#bbbbbb"
        >
        </el-switch>
      </CardRow>
    </Card>

    <Card header="加密时用的key：">
      <CardRow description="加密时用的key">
        <el-input v-model="AesKey"></el-input>
      </CardRow>
    </Card>

    <Card header="iv 偏移量：">
      <CardRow description="iv 偏移量">
        <el-input v-model="AesIv"></el-input>
      </CardRow>
    </Card>

    <Card header="上传图片：">
      <CardRow class="box">
        <div class="avatar-box">
          <div class="avatar-somer-box" v-for="(item, index) in numberimg" :key="index">
            <el-upload class="avatar-uploader" action :http-request="
                e => {
                  uploaderLogo(e, index);
                }
              " :show-file-list="false" :on-success="handleAvatarSuccess" @change="handleFile"
              :before-upload="beforeAvatarUpload">
              <div v-if="item.imageUrl" class="avatar">
                <img :src="item.imageUrl" class="avatar-LogoImage" :alt="item.text" :title="item.text" :style="{
                    width: 140 + 'px',
                  }" />
              </div>
              <i v-else class="el-icon-circle-plus-outline"></i>
              <p class="avatar-logo">{{ item.text }}</p>
              <p class="avatar-pm">{{ item.textrule }}</p>
              <p class="avatar-pm">大小：小于5M</p>
            </el-upload>
            <el-button type="text" class="avatar-btn" @click="
                file => {
                  deleteImage(file, index);
                }
              ">删除</el-button>
            <!-- <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>-->
          </div>
        </div>
      </CardRow>
    </Card>
    <Card header="站长：">
      <CardRow description="填写站长的用户id">
        <el-input placeholder="站长" type="number" v-model="siteMasterId"></el-input>
      </CardRow>
    </Card>
    <Card header="站点模式：" class="card-radio-con">
      <CardRow description="你的Discuz! Q 站点的运行模式">
        <el-radio @change="radioChange('public')" v-model="radio" label="1">公开模式</el-radio>
        <el-radio @change="radioChange('pay')" v-model="radio" label="2" :disabled="disabled">付费模式</el-radio>
      </CardRow>
    </Card>

    <el-collapse-transition>
      <div v-show="radio === '2'">
        <Card header="加入价格（元）：">
          <CardRow description="付费模式下，付费成为站点默认角色，需支付的金额">
            <el-input placeholder="加入价格" type="number" v-model="sitePrice"></el-input>
          </CardRow>
        </Card>

        <Card header="到期时间：">
          <CardRow description="付费模式下，付费成为站点默认角色的有效时间">
            <el-radio v-model="expireRadio" label="1">
              加入起
              <el-input
                class="elinput"
                style="height: 36PX;width: 160PX"
                placeholder="天数"
                type="number"
                size="small"
                v-model="siteExpire"
                @blur.native.capture="onExpireBlurFun"
              ></el-input>天后
            </el-radio>
            <el-radio
              v-model="expireRadio"
              label="2"
            >永久有效</el-radio>
          </CardRow>
        </Card>
      </div>
    </el-collapse-transition>

    <Card header="金额分成比例：">
      <CardRow description="主题打赏、付费等的分成比例设置，两者加起来必须为10，不填时默认为作者10、平台0">
        <div class="proportion-box">
          <span>作者</span>
          <el-input class size="small" type="number" v-model="siteAuthorScale" @blur.native.capture="onblurFun">
          </el-input>
        </div>
        <div class="proportion-box">
          <span>平台(站长)</span>
          <el-input size="small" type="number" v-model="siteMasterScale" @blur.native.capture="onblurFun"></el-input>
        </div>
      </CardRow>
    </Card>

    <Card header="网站备案信息：">
      <div class="record-top">
        <CardRow description="你的Discuz! Q 站点的 ICP 备案编号">
          <el-input v-model="siteRecord"></el-input>
        </CardRow>
      </div>
    </Card>

    <Card header="公安备案信息：">
      <div class="record-bottom">
        <CardRow description="你的Discuz! Q 站点的 公安备案编号">
          <el-input v-model="recodeNumber"></el-input>
        </CardRow>
      </div>
    </Card>

    <Card header="第三方统计：">
      <CardRow description="你的Discuz! Q 网站的第三方统计代码（禁止使用含有document.write的统计代码）">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="siteStat"></el-input>
      </CardRow>
    </Card>

    <Card header="站点开关：" class="card-radio-con">
      <CardRow description="站点当前开放的可访问的端，勾选则代表开启">
        <el-radio @change="radioChangeClose('1')" v-model="radio2" label="1">关闭</el-radio>
        <el-radio @change="radioChangeClose('2')" v-model="radio2" label="2">开启</el-radio>

        <!-- <el-checkbox-group @change="closeListChange" v-model="closeSelectList">
          <el-checkbox v-for="item in closeList" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group> -->
      </CardRow>
    </Card>

    <el-collapse-transition>
      <div v-show="radio2 === '1'">
        <Card header>
          <CardRow description="站点关闭时出现的提示信息">
            <el-input v-model="siteCloseMsg"></el-input>
          </CardRow>
        </Card>
      </div>
    </el-collapse-transition>

    <!-- <el-collapse-transition>
      <div v-show="changeCloseList">
        <Card header>
          <CardRow description="未开启且被访问时的提示信息">
            <el-input v-model="siteCloseMsg"></el-input>
          </CardRow>
        </Card>
      </div>
    </el-collapse-transition> -->

    <Card class="footer-btn">
      <el-button type="primary" size="medium" @click="siteSetPost">提交</el-button>
    </Card>
  </div>
</template>
<style>
  .disabled .el-upload--picture-card {
    display: none;
  }

</style>
<script>
  import "../../../scss/site/module/globalStyle.scss";
  import siteSetCon from "../../../controllers/site/global/siteSetCon";

  export default {
    name: "site-set-view",
    ...siteSetCon
  };

</script>
