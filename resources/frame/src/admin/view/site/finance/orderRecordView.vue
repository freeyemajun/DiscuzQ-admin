<template>
  <div class="order-record-box">
    <!-- 搜索条件 -->
    <div class="order-record__search-box">
      <div class="order-record__search-condition">
        <span class="order-record__search-condition__title">订单号：</span>
        <el-input
          clearable
          v-model="orderNumber"
          placeholder="搜索订单号"
        ></el-input>
      </div>

      <div class="order-record__search-condition">
        <span class="order-record__search-condition__title">订单时间：</span>
        <el-date-picker
          v-model="orderTime"
          clearable
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="handleTimeChange"
        >
        </el-date-picker>
      </div>

      <div class="order-record__search-condition">
        <span class="order-record__search-condition__title">发起方：</span>
        <el-input
          clearable
          v-model="operationUser"
          placeholder="搜索发起方"
        ></el-input>
      </div>

      <div class="order-record__search-condition">
        <span class="order-record__search-condition__title">商品：</span>
        <el-input
          clearable
          v-model="commodity"
          placeholder="搜索商品"
        ></el-input>
      </div>

      <div class="order-record__search-condition">
        <span class="order-record__search-condition__title">订单状态：</span>
        <el-select v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      
      <div class="order-record__search-condition">
        <span class="order-record__search-condition__title">订单类型：</span>
        <el-select v-model="orderValue" clearable placeholder="请选择">
          <el-option
            v-for="item in orderType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="order-record__search-condition">
        <span class="order-record__search-condition__title">收入方：</span>
        <el-input
          clearable
          v-model="incomeSide"
          placeholder="搜索收入方"
        ></el-input>
      </div>

      <div class="order-record__search-condition">
        <el-button type="primary" size="medium" @click="searchClick"
          >搜索</el-button
        >
      </div>
    </div>
    <!-- 订单记录列表 -->
    <div class="order-record-table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="orderSn" label="订单号" min-width="110">
        </el-table-column>

        <el-table-column prop="nickname" label="发起方">
        </el-table-column>

        <el-table-column prop="payeeNickname" label="收入方">
        </el-table-column>

        <el-table-column
          prop="thread.title"
          show-overflow-tooltip
          label="商品名称"
          min-width="150"
        >
          <template slot-scope="scope">
            <span
              :class="scope.row.thread ? 'cursor-pointer' : ''"
              v-if="
                scope.row.thread && (
                  scope.row.type === 2 ||
                  scope.row.type === 3 ||
                  scope.row.type === 5 ||
                  scope.row.type === 6 ||
                  scope.row.type === 7 ||
                  scope.row.type === 8 ||
                  scope.row.type === 9 ||
                  scope.row.type === 10 ||
                  scope.row.type === 11
                )"
                @click="viewClick(scope.row.thread ? scope.row.thread.threadId : '')"
            >
              {{ scope.row.thread.title }}
            </span>
            <span v-else-if="scope.row.type === 1" @click="viewClick('')">
              注册付费
            </span>
            <span v-else-if="scope.row.type === 4" @click="viewClick('')">
              {{ scope.row.group ? scope.row.group.name : '' }}用户组
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="thread.content"
          show-overflow-tooltip
          label="类型"
          min-width="80"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">
              注册(站点付费加入)
            </span>
            <span v-else-if="scope.row.type === 2">
              打赏
            </span>
            <span v-else-if="scope.row.type === 3">
              购买主题
            </span>
            <span v-else-if="scope.row.type === 4">
              购买权限组
            </span>
            <span v-else-if="scope.row.type === 5">
              付费提问
            </span>
            <span v-else-if="scope.row.type === 6">
              问答围观付费
            </span>
            <span v-else-if="scope.row.type === 7">
              购买附件
            </span>
            <span v-else-if="scope.row.type === 8">
              站点付费(续费)
            </span>
            <span v-else-if="scope.row.type === 9">
              红包
            </span>
            <span v-else-if="scope.row.type === 10">
              悬赏
            </span>
            <span v-else-if="scope.row.type === 11">
              合并订单(红包+悬赏合并支付)
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="amount" label="金额" width="100">
        </el-table-column>

        <el-table-column prop="createdAt" label="订单时间">
          <template slot-scope="scope">{{
            formatDate(scope.row.createdAt)
          }}</template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template slot-scope="scope">{{
            cashStatus(scope.row.status)
          }}</template>
        </el-table-column>
      </el-table>

      <Page
        v-if="pageCount > 1"
        @current-change="handleCurrentChange"
        :current-page="currentPaga"
        :page-size="10"
        :total="total"
      >
      </Page>
    </div>
  </div>
</template>

<script>
import "../../../scss/site/module/financeStyle.scss";
import orderRecordCon from "../../../controllers/site/finance/orderRecordCon";
export default {
  name: "order-details",
  ...orderRecordCon
};
</script>
