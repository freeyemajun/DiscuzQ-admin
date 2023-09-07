<template>
  <div class="shop-box">
    <Card header="微信小商店"></Card>
    
    <!-- <Card header="小商店二维码上传" class="shop-box-img">
      <div>
        <div class="avatar-shop">
          <img
              v-if="deleteBtn"
              :src="imageUrl"
              class="avatar-LogoImage"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </div>
    </Card> -->
    
    <Card class="config-cdn-domain config-cdn-shop">
      <span class="config-cdn-domain__name"> appid </span>
      <el-input
        v-model="shopAppId"
        class="elinput"
        style="height: 36px; width: 400px"
        size="small"
      ></el-input>
    </Card>

    <Card class="config-cdn-domain config-cdn-shop">
      <span class="config-cdn-domain__name"> secret key </span>
      <el-input
        v-model="shopSecretKey"
        class="elinput"
        style="height: 36px; width: 400px"
        size="small"
      ></el-input>
    </Card>

    <Card class="config-cdn-address config-shop-address">
      <p class="config-cdn-address__text"> 小店介绍 </p>
      <div class="config-cdn-address__box">
        <el-input
          class="config-cdn-address__input"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="shopTranslate"
        >
        </el-input>
      </div>
    </Card>

    <Card class="footer-btn" >
      <el-button type="primary" size="medium" @click="parameterSubmit">提交</el-button>
    </Card>
  </div>
</template>

<script>
import '../../../../scss/site/module/globalStyle.scss';
import pyaConfigWxCon from '../../../../controllers/site/global/otherService/otherServiceWechatShopCon';
export default {
    name: "other-service-wechat-shop-view",
  ...pyaConfigWxCon
}
</script>