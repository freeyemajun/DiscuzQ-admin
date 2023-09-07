<template>
  <div class="site-sort-set-box">
    <div>
      <!-- 添加内容 -->
      <div class="sort-switch-header">
        <p class="sort-desc"  @click="jumpDataRules">推荐首页</p>
        <p class="data-rules repeat">数据规则</p>
      </div>
      <Card class="sort-switch-radio">
        <p class="sort-switch-radio_title">阅读数计算方式</p>
        <div class="sort-switch-radio_option">
          <el-radio v-model="radio" label="1" :class="radio === '1' ? 'sort-switch-radio_cont' : ''">仅点进帖子详情页增加阅读数</el-radio>
        </div>
        <div>
          <el-radio v-model="radio" label="0" :class="radio === '0' ? 'sort-switch-radio_cont' : ''">操作首页帖子、进入详情页，增加阅读数</el-radio>
        </div>
        <p class="sort-switch-radio_explain">说明：操作包括点赞、点击"查看更多"、分享、下载附件、点开图片预览、播放视频、播放语音、点击帖子中包含的链接或话题。</p>
      </Card>

      <Card class="sort-switch-exhibition">
        <div class="sort-switch-exhibition__box">
          <p class="sort-switch-exhibition__box-title">首页默认展示分类</p>
          <p class="sort-switch-exhibition__box-explain">用户进入首页时展示的内容分类</p>
        </div>
        <el-radio-group v-model="exhibition">
          <el-radio :label="1">所有</el-radio>
          <el-radio :label="2">推荐</el-radio>
          <el-radio :label="3">精华</el-radio>
          <el-radio :label="4">已关注</el-radio>
        </el-radio-group>
      </Card>

      <p class="user-rol-table__pay">首页置顶管理</p>
      <p v-if="upgradeData.length <= 0" class="user-rol-table__pay">暂无置顶贴，可在内容-内容管理中进行设置。</p>
      <div class="user-rol-table"  v-if="upgradeData.length > 0">
        <el-table
          :data="upgradeData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <el-table-column width="150" label="展示顺序">
            <template slot-scope="scope">
              <div class="user-rol-table-box">
                <span
                  :class="groupEdit ? 'user-rol-table__frame' : ''"
                  @click="dropOperation(scope)"
                  v-if="scope.$index !== upgradeData.length - 1"
                >
                  <i class="iconfont icon-xiangxiaicon table-icon"></i>
                </span>
                <span
                  :class="scope.$index === upgradeData.length - 1 ? groupEdit ? 'user-rol-table__right user-rol-table__frame' : 'user-rol-table__rights' : groupEdit ? 'user-rol-table__frame' : ''"
                  @click="riseOperation(scope)"
                  v-if="scope.$index !== 0"
                >
                  <i class="iconfont icon-xiangshang table-icon"></i>
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="帖子标题/内容"
            width="400"
          >
            <template slot-scope="scope">
              <a class="user-rol-table-box__text" :href="'/thread/' + scope.row.threadId" target="_blank" v-html="$xss(filterContent(scope.row.title))"></a>
            </template>
          </el-table-column>

          <el-table-column width="150" label="操作">
            <template slot-scope="scope">
              <p class="site-function-set-box__topping">
                <el-button type="text" @click="relieveToppingopen(scope)">取消置顶</el-button>
              </p>
            </template>
          </el-table-column>

          <el-table-column>
            <p></p>
          </el-table-column>
        </el-table>
      </div>
      <el-button class="site-sort-set-box__btn" type="primary" size="medium" @click="ruleSubmission">提交</el-button>
    </div>
  </div>
</template>

<script>
  import "../../../../scss/site/module/globalStyle.scss";
  import siteDataRulesCon from "../../../../controllers/site/global/siteSet/siteDataRulesCon";
  export default {
    name: "site-data-rules",
    ...siteDataRulesCon
  };
</script>