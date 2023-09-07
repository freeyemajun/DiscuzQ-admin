<template>
    <div class="notice-list-box">
      <div class="notice-list-table marT15">
        <el-table
          :data="tableData"
          style="width: 100%">

          <el-table-column
            prop=""
            label="序号"
            width="100">
            <template slot-scope="scope">
              <span v-text="getIndex(scope.$index)"> </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="typeName"
            label="通知类型"
           >
          </el-table-column>

          <el-table-column
          prop="name"
          label="状态"
          width="100"
          align="center"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.status" class="iconfont iconicon_select" ></span>
          <span v-else class="iconfont iconicon_"  ></span>
        </template>
        </el-table-column>

          <el-table-column
          prop="address"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="configClick(scope.row.id,scope.row._data.typeName)">
              配置
            </el-button>
            <el-button
              v-if="scope.row.status == 0"
              size="mini"
              @click.native.prevent="noticeSetting(scope.row.id,'open')"
            >开启
            </el-button>
            <el-button
              v-if="scope.row.status == 1"
              @click.native.prevent="noticeSetting(scope.row.id,'close')"
              size="mini">
              关闭
            </el-button>
          </template>
        </el-table-column>

        </el-table>
        <Page v-if="total > 1" :total="total" :pageSize="pageLimit" :currentPage="pageNum" @current-change="handleCurrentChange" />
      </div>

    </div>
</template>

<script>
import '../../../../scss/site/module/globalStyle.scss';
// import WxNoticeSetCon from '../../../../controllers/site/global/notice/WxNoticeSetCon';
export default {
    // name: "withdrawal-application-view",
  // ...WxNoticeSetCon
}
</script>
