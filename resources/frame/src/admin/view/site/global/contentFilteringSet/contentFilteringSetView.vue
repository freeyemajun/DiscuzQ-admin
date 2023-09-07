<template>
    <div class="content-filter-set-box">
      <p class="ip-filter">内容过滤</p>
      <div class="content-filter-set__search">
        <Card>
          <el-input  size="medium" class="el-cascader__search-input" v-model="serachVal" clearable placeholder="搜索过滤词"></el-input>
          <el-button size="medium" class="content-filter-set__search-button"  @click="onSearch" >搜索</el-button>
        </Card>
      </div>

      <main class="content-filter-set-main">
        <p class="list-set-box">
          <span  @click="$router.push({path:'/admin/add-sensitive-words'})" >批量添加</span>
          <span @click="exportUrlContent" >导出过滤词库</span>
          <!-- <a :href="exportUrl">导出过滤词库</a> -->
        </p>

        <div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>

            <el-table-column
              label="过滤词"
            >
              <template slot-scope="scope">
                {{ !scope.row.addInputFlag ? scope.row.find : ''}}
                <el-input
                  splaceholder="请输入过滤词"
                  clearable
                  v-model="scope.row.find"
                  v-show="scope.row.addInputFlag"
                >
                </el-input> 
              </template>

            </el-table-column>

            <el-table-column
              label="主题和回复处理方式"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.ugc" placeholder="请选择" @change="selectChange(scope)">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              prop="address"
              label="用户名处理方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.username" placeholder="请选择" @change="selectChange(scope)">
                  <el-option
                    v-for="item in optionsUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>


            <el-table-column
              prop="address"
              label="签名处理方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.signature" placeholder="请选择" @change="selectChange(scope)">
                  <el-option
                    v-for="item in optionsUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              prop="address"
              label="短消息处理方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.dialog" placeholder="请选择" @change="selectChange(scope)">
                  <el-option
                    v-for="item in optionsUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              prop="address"
              label="用户昵称处理方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.nickname" placeholder="请选择" @change="selectChange(scope)">
                  <el-option
                    v-for="item in optionsUser"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              prop="address"
              label="过滤词替换">
              <template slot-scope="scope">
                <el-input v-model="scope.row.replacement" placeholder="请输入替换内容" :disabled="scope.row.ugc !== '{REPLACE}' && scope.row.username !== '{REPLACE}'" clearable v-show="replace"></el-input>
              </template>
            </el-table-column>

          </el-table>

          <TableContAdd @tableContAddClick="tableContAdd" cont="新增"></TableContAdd>
          <Page :total="total" :pageSize="pageLimit" :current-page.sync="pageNum" @current-change="handleCurrentChange" />
        </div>
        
        <Card class="footer-btn">
          <el-button type="primary" size="medium" @click="loginStatus">提交</el-button>
          <el-button size="medium" :disabled="deleteStatus" @click="deleteWords">删除</el-button>
        </Card>
        
        <div>
          <p class="ip-filter">IP过滤</p>
          <p class="ip-filter-text">内网IP黑名单</p>
          <el-table
            class="content-filter-set__ip"
            ref="multipleTable"
            :data="optionsIpData" 
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="deleteChanges">
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>

            <el-table-column
              label="IP地址"
              width="200"
            >
              <template slot-scope="scope">
                <el-input
                  clearable
                  v-model="scope.row.domainName"
                >
                </el-input> 
              </template>
            </el-table-column>
            <el-table-column
              label="掩码位"
              width="200"
            >
              <template slot-scope="scope">
                <el-input
                  clearable
                   v-model="scope.row.domainMask"
                >
                </el-input> 
              </template>
            </el-table-column>
            <el-table-column
              label=""
            >
            </el-table-column>
          </el-table>

          <TableContAdd @tableContAddClick="increaseIpAdd" cont="新增"></TableContAdd>
        </div>

        <Card class="footer-btn">
          <el-button type="primary" size="medium" @click="ipDataLoginStatus">提交</el-button>
          <el-button size="medium" :disabled="ipDeleteStatus" @click="ipDataDelete">删除</el-button>
        </Card>
      </main>

      <!--<div class="batch-set-box" v-if="loginStatus === 'batchSet'">
        <Card header="批量添加本地敏感词：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 5}"
            placeholder="敏感词">
          </el-input>

          <el-radio-group text-color="#67C23A" fill="#67C23A" v-model="radio2">
            <div>
              <el-radio  label="1">不导入已经存在的词语</el-radio>
            </div>
            <div>
              <el-radio  label="2">使用新的设置覆盖已经存在的词语</el-radio>
            </div>
          </el-radio-group>

        </Card>

        <Card >
          <el-button type="primary" size="medium" @click="loginStatus = 'default'">提交</el-button>
        </Card>

        <Card>
          <h2>提示：</h2>
          <p>批量添加内容格式：</p>
          <p>敏感词内容|主题和回复处理方式表示|用户名处理方式标识。主题的处理方式标识未 不处理0，禁止1，替换为*2，审核3；</p>
          <p>用户名的处理方式标识为 不处理0，禁止1，举例：</p>
          <p>敏感词一号|1|1</p>
          <p>敏感词二号|2|1</p>
        </Card>

      </div>-->

    </div>
</template>

<script>
import contentFilteringSetCon from '../../../../controllers/site/global/contentFilteringSet/contentFilteringSetCon';
import '../../../../scss/site/module/globalStyle.scss';
export default {
    name: "content-filtering-set-view",
  ...contentFilteringSetCon
}
</script>
