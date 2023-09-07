<template>
  <div class="chatgpt-set-box">
    <Card header="反代地址：">
      <CardRow description="推荐自建反代（搭建联系微信Naruto1986519）">
        <el-input v-model="fandaiurl"></el-input>
      </CardRow>
    </Card>

    <Card header="openApiKey：">
      <CardRow description="openApiKey">
        <el-input v-model="apikey"></el-input>
      </CardRow>
    </Card>

    <Card header="网站地址：">
      <CardRow description="自己网站的地址 如https://www.baidu.com">
        <el-input v-model="hosturl"></el-input>
      </CardRow>
    </Card>

    <Card header="对话模型：" class="card-radio-con">
      <CardRow description="Chat对话model">
        <el-radio @change="changeModel('gpt-3.5-turbo')" v-model="model" label="gpt-3.5-turbo">3.5</el-radio>
        <el-radio @change="changeModel('gpt-4')" v-model="model" label="gpt-4">4</el-radio>
      </CardRow>
    </Card>

    <Card header="ChatGpt回复分类ID：">
      <CardRow description="多个请用,隔开，例如 1,2,3,4">
        <el-input v-model="aicid"></el-input>
      </CardRow>
    </Card>

    <Card header="是否开启@自动回复">
      <CardRow class="card-pay" description="是否开启@自动回复。">
        <el-switch
          v-model="callai"
          active-color="#336699"
          inactive-color="#bbbbbb"
        >
        </el-switch>
      </CardRow>
    </Card>

    <Card header="ChatGpt用户UID：">
      <CardRow description="ChatGpt用户UID">
        <el-input v-model="aiuid"></el-input>
      </CardRow>
    </Card>

    <Card header="ChatGpt用户名：">
      <CardRow description="ChatGpt用户名">
        <el-input v-model="aiusername"></el-input>
      </CardRow>
    </Card>

    <Card header="ChatGpt用户密码：">
      <CardRow description="ChatGpt用户密码">
        <el-input v-model="aipassword"></el-input>
      </CardRow>
    </Card>

    <Card header="ChatGpt人格设置：">
      <CardRow description="设置ChatGpt人格">
        <el-input v-model="airenge"></el-input>
      </CardRow>
    </Card>

    <Card header="是否开启接入公众号">
      <CardRow class="card-pay" description="是否接入公众号。">
        <el-switch
          v-model="offiaccount"
          active-color="#336699"
          inactive-color="#bbbbbb"
          @change="openoff"
        >
        </el-switch>
      </CardRow>
    </Card>

    <Card header="是否开启公众号语音回复">
      <CardRow class="card-pay" description="是否开启公众号语音回复(请开通腾讯云语音合成服务)。">
        <el-switch
          v-model="revoice"
          active-color="#336699"
          inactive-color="#bbbbbb"
          @change="openrevoice"
        >
        </el-switch>
      </CardRow>
    </Card>

    <Card class="footer-btn">
      <el-button type="primary" size="medium" @click="submi">提交</el-button>
    </Card>
  </div>
</template>

<script>
import chatgptSetCon from "../../../controllers/site/global/chatgptSetCon";
import '../../../scss/site/module/globalStyle.scss';

export default {
  name: "chatgpt-set-view",
  ...chatgptSetCon
}
</script>

<style scoped>

</style>
