<template>
  <div class="site-theme-box">
      <div class="site-theme-head">选择发布方式：</div>
      <div class="site-theme-content">
        <div class="left">
          <el-radio v-model="fabu" :label="1">
            伸缩按钮
            <img
              class="theme-img"
              ref="img1"
              src="/static-admin/images/fabu1.png"
              alt="蓝色皮肤"
            >
          </el-radio>
          <el-radio v-model="fabu" :label="2">
            多行展示
            <img
              class="theme-img"
              ref="img2"
              src="/static-admin/images/fabu2.png"
              alt="多行展示"
            >
          </el-radio>
          <el-radio v-model="fabu" :label="3">
            上下互换
            <img
              class="theme-img"
              ref="img3"
              src="/static-admin/images/fabu3.png"
              alt="上下互换"
            >
          </el-radio>
          <el-radio v-model="fabu" :label="4">
            伸缩按钮
            <img
              class="theme-img"
              ref="img4"
              src="/static-admin/images/fabu4.png"
              alt="伸缩按钮"
            >
          </el-radio>
        </div>
      </div>

      <el-button size="medium" type="primary" @click="handlePublishingSubmit">提交</el-button>
  </div>
  <!--div class="site-function-set-box">

    <Card header="发布页面设置：" class="card-radio-con">
      <CardRow>
        <el-radio-group v-model="fabu" class="kuq-buhuanhang">
            <el-radio :label="1" class="kuq-juzhong kuq-kuan-500">

              <img
                class="theme-imgs"
                ref="img1"
                src="/static-admin/images/fabu1.png"
                alt="伸缩按钮"
              ><p>伸缩按钮1</p>
            </el-radio>
            <el-radio :label="4" class="kuq-juzhong kuq-kuan-500">

              <img
                class="theme-imgs"
                ref="img1"
                src="/static-admin/images/fabu4.png"
                alt="伸缩按钮"
              >
              <p>伸缩按钮2</p>
              </el-radio>
            <el-radio :label="2" class="kuq-juzhong kuq-kuan-500">

              <img
                class="theme-imgs"
                ref="img1"
                src="/static-admin/images/fabu2.png"
                alt="多行展示"
              ><p>多行展示</p>

            </el-radio>
            <el-radio :label="3" class="kuq-juzhong kuq-kuan-500">

              <img
                class="theme-imgs"
                ref="img1"
                src="/static-admin/images/fabu3.png"
                alt="上下互换"
              >
              <p>上下互换</p>
              </el-radio>
          </el-radio-group>
      </CardRow>
    </Card>



    <el-button type="primary" size="medium" @click="handlePublishingSubmit">提交</el-button>

  </div-->
</template>

<script>
  import "../../../../scss/site/module/globalStyle.scss";
  import siteJiemianCon from "../../../../controllers/site/global/siteSet/siteJiemianCon";
  export default {
    name: "site-jiemian-view",
    ...siteJiemianCon
  };
</script>
