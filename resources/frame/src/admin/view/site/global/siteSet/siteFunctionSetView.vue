<template>
  <div class="site-function-set-box">
    <Card class="recharge-points">
       <div class="recharge-points__lf">
         <el-checkbox v-model="titles">标题</el-checkbox>
       </div>
       <div class="recharge-points__rf">
         <p>开启标题。</p>
         <p>关闭标题</p>
       </div>
     </Card>



    <!-- <Card>
      <CardRow
        class="card-points"
        description="开启后，用户角色将可以配置价格和有效期，用户可在前台进行用户角色购买"
      >
        <el-checkbox v-model="purchase">权限购买功能</el-checkbox>
      </CardRow>
    </Card> -->

    <Card header="打赏开启：" class="card-radio-con">
      <CardRow description="打赏开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListreward">
          <el-checkbox v-for="item in closeListreward" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="悬赏开启：" class="card-radio-con">
      <CardRow description="悬赏开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListareward">
          <el-checkbox v-for="item in closeListareward" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="红包开启：" class="card-radio-con">
      <CardRow description="红包开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListredpacket">
          <el-checkbox v-for="item in closeListredpacket" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="匿名开启：" class="card-radio-con">
      <CardRow description="匿名开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListanonymous">
          <el-checkbox v-for="item in closeListanonymous" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="私信开启：" class="card-radio-con">
      <CardRow description="私信开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListpersonalletter">
          <el-checkbox v-for="item in closeListpersonalletter" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="商品开启：" class="card-radio-con">
      <CardRow description="商品开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListshop">
          <el-checkbox v-for="item in closeListshop" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="帖子付费开启：" class="card-radio-con">
      <CardRow description="帖子付费开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListpay">
          <el-checkbox v-for="item in closeListpay" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="用户组付费开启：" class="card-radio-con">
      <CardRow description="用户组付费开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListusergroup">
          <el-checkbox v-for="item in closeListusergroup" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="充值开启：" class="card-radio-con">
      <CardRow description="充值开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListrecharge">
          <el-checkbox v-for="item in closeListrecharge" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="提现开启：" class="card-radio-con">
      <CardRow description="提现开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListwithdrawal">
          <el-checkbox v-for="item in closeListwithdrawal" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card header="评论开启：" class="card-radio-con">
      <CardRow description="评论开启，勾选则代表开启">
        <el-checkbox-group v-model="closeSelectListcomment">
          <el-checkbox v-for="item in closeListcomment" :key="item.key" :label="item.key">
            {{ item.desc }}
          </el-checkbox>
        </el-checkbox-group>
      </CardRow>
    </Card>
    <Card>
      <CardRow class="publishing-title other">
        其它功能
      </CardRow>
    </Card>
    <Card>
      <CardRow
        class="card-points"
        description="一键关闭,关闭后，这些功能将无法在站内使用。(仅限小程序)"
      >
        <el-checkbox v-model="reward">打赏、悬赏、红包、匿名、私信、商品、帖子付费、用户组付费、充值，提现</el-checkbox>
      </CardRow>
    </Card>
    

   <Card class="recharge-points">
      <div class="recharge-points__lf">
        <el-checkbox v-model="recharge">充值</el-checkbox>
      </div>
      <div class="recharge-points__rf">
        <p>开启后，用户可在站内自主充值钱包余额。</p>
        <p>根据相关规定，开启自动充值功能站长需先取得ICP增值业务许可证，请确保已获取相关资质后开启本功能，否则责任自负</p>
      </div>
    </Card>



    <el-button type="primary" size="medium" @click="handlePublishingSubmit">提交</el-button>

  </div>
</template>

<script>
  import "../../../../scss/site/module/globalStyle.scss";
  import siteFunctionSetCon from "../../../../controllers/site/global/siteSet/siteFunctionSetCon";
  export default {
    name: "site-function-set-view",
    ...siteFunctionSetCon
  };
</script>
