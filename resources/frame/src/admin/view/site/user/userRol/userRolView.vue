<template>
  <div class="user-rol-box">
    <div class="user-rol-table">
      <p class="user-rol-table__pay">付费用户组</p>
      <el-table
        :data="upgradeData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        >
        </el-table-column>

        <el-table-column
          label="级别"
          min-width="20"
        >
          <template slot-scope="scope">
             <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>

        <el-table-column label="级别名称" width="240">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>

        <el-table-column width="100" label="显示组名">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.id === 7"
              v-model="scope.row.isDisplay"
              active-color="#336699"
              inactive-color="#bbbbbb"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column width="200">
          <template slot-scope="scope">
            <el-button size="medium" @click="extension(scope.row.id)"
              >邀请</el-button
            >
            <el-button
              v-if="scope.row.id !== 1"
              :disabled="addStatus && tableData.length - 1 === scope.$index"
              type="text"
              @click="
                $router.push({
                  path: '/admin/rol-permission',
                  query: { type: 'isPaid', id: scope.row.id, name: scope.row.name },
                })
              "
              >设置</el-button
            >
            <el-popover
              width="100"
              placement="top"
              v-model="scope.row.visible"
            >
              <p>删除后，付费用户组中的用户将被移入默认分组或其他付费分组</p>
              <div style="text-align: right; margin: 10px 0 0 0">
                <el-button
                  type="danger"
                  size="mini"
                  @click="
                    cancelClick(scope)
                  "
                >
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="
                    singleDelete(scope.$index, scope.row.id, 'pay');
                  "
                  >确定</el-button
                >
              </div>
              <el-button
                slot="reference"
                v-if="
                  scope.row.id !== 1 &&
                  scope.row.id !== 6 &&
                  scope.row.id !== 7 &&
                  scope.row.id !== 10 &&
                  scope.row.default !== 1
                "
                type="text"
                >删除</el-button
              >
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column min-width="50" label="级别顺序">
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
      </el-table>
      <TableContAdd cont="新增" v-if="upgradeData.length < 5" @tableContAddClick="upgradeList"></TableContAdd>
    </div>

    <Card class="footer-btn">
      <el-button
        type="primary"
        :loading="paidLoading"
        size="medium"
        @click="paidNewbtn"
        >提交</el-button
      >
      <el-button
        size="medium"
        :loading="delpaidLoading"
        :disabled="deleteStatus"
        @click="deleteClick"
        >删除</el-button
      >
    </Card>

    <div class="user-rol-table">
      <p class="user-rol-table__pay">免费用户组</p>
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        >
        </el-table-column>

        <el-table-column label="级别名称" width="240">
          <template slot-scope="scope">
            <el-input maxlength="20" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>

        <el-table-column width="100" label="显示组名">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.id === 7"
              v-model="scope.row.isDisplay"
              active-color="#336699"
              inactive-color="#bbbbbb"
            >
            </el-switch>
          </template>
        </el-table-column>

        <!-- <el-table-column width="100">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.id !== '7' && scope.row.id !== '1'"
              :disabled="addStatus && tableData.length - 1 === scope.$index"
              type="text"
              @click="
                $router.push({
                  path: '/admin/rol-permission',
                  query: {
                    id: scope.row.id,
                    name: scope.row.name,
                    title: '其他设置',
                    names: 'other',
                  },
                })
              "
              >允许购买</el-button
            >
          </template>
        </el-table-column> -->

        <el-table-column>
          <template slot-scope="scope">
            <el-button size="medium" @click="extension(scope.row.id)"
              >邀请</el-button
            >
            <el-button
              v-if="scope.row.id !== 1"
              :disabled="addStatus && tableData.length - 1 === scope.$index"
              type="text"
              @click="
                $router.push({
                  path: '/admin/rol-permission',
                  query: { type: 'normal', id: scope.row.id, name: scope.row.name },
                })
              "
              >设置</el-button
            >
            <el-popover
              width="100"
              placement="top"
              :ref="`popover-${scope.$index}`"
            >
              <p>确定删除该项吗？</p>
              <div style="text-align: right; margin: 10px 0 0 0">
                <el-button
                  type="danger"
                  size="mini"
                  @click="
                    scope._self.$refs[`popover-${scope.$index}`].doClose()
                  "
                >
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="
                    singleDelete(scope.$index, scope.row.id, 'normal');
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                  "
                  >确定</el-button
                >
              </div>
              <el-button
                slot="reference"
                v-if="
                  scope.row.id !== 1 &&
                  scope.row.id !== 6 &&
                  scope.row.id !== 7 &&
                  scope.row.id !== 10 &&
                  scope.row.default !== 1 &&
                  scope.row.id !== 8
                "
                type="text"
                >删除</el-button
              >
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column min-width="115">
          <template slot-scope="scope">
            <el-radio
              v-model="radio"
              @change="radioChange(scope.row, scope.$index)"
              v-if="
                scope.row.id != 1 && scope.row.id !== 6 && scope.row.id !== 7
              "
              :label="scope.row.id"
              >设为加入站点的默认级别</el-radio
            >
          </template>
        </el-table-column>
      </el-table>
      <TableContAdd cont="新增" @tableContAddClick="addList"></TableContAdd>
    </div>

    <Card class="footer-btn">
      <el-button
        type="primary"
        :loading="btnLoading"
        size="medium"
        @click="submitClick"
        >提交</el-button
      >
      <el-button
        size="medium"
        :loading="delLoading"
        :disabled="deleteStatus"
        @click="deleteClick"
        >删除</el-button
      >
    </Card>
  </div>
</template>

<script>
import "../../../../scss/site/module/userStyle.scss";
import userRolCon from "../../../../controllers/site/user/userRol/userRolCon";
export default {
  name: "user-rol-view",
  ...userRolCon,
};
</script>
